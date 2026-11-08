import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import env from "./config/env";
import sequelize from "./config/basedatos";
import AppError from "./helpers/AppError";
import errorHandler from "./middlewares/errorHandler";
import "./models"; // registra modelos y asociaciones
import routes from "./routes";

const app = express();

// =====================================================
// MIDDLEWARES GENERALES
// =====================================================

app.use(
    helmet({
        // Las imagenes de /uploads deben poder cargarse desde el front (otro origen).
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

app.use(
    cors({
        origin: env.CORS_ORIGIN.includes("*") ? true : env.CORS_ORIGIN
    })
);

app.use(morgan(env.esProduccion ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// =====================================================
// ARCHIVOS SUBIDOS (public/uploads/<entidad>/<id>/<archivo>)
// =====================================================

app.use(
    "/uploads",
    express.static(env.UPLOAD_DIR, {
        index: false,
        dotfiles: "deny",
        maxAge: env.esProduccion ? "7d" : 0
    })
);

// Resto de la carpeta public (si se agregan archivos estaticos)
app.use(express.static(path.resolve(process.cwd(), "public"), { index: false, dotfiles: "deny" }));

// =====================================================
// CONEXION CON LA BASE DE DATOS
// =====================================================

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();

        console.log(`Conexion con la base de datos ${env.DB_NAME} establecida correctamente.`);
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        throw error;
    }
};

// =====================================================
// RUTAS
// =====================================================

app.get("/nueva", (_req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is working correctly"
    });
});

app.use("/api", routes);

// Ruta no encontrada
app.use((req, _res, next) => {
    next(new AppError(`No existe la ruta: ${req.originalUrl}`, 404));
});

// Manejador centralizado de errores
app.use(errorHandler);

export default app;
