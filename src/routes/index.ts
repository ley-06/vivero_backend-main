import { Router } from "express";
import authRoutes from "./authRoutes";
import clienteRoutes from "./clienteRoutes";
import compraRoutes from "./compraRoutes";
import productoRoutes from "./productoRoutes";
import servicioRoutes from "./servicioRoutes";
import solicitudRoutes from "./solicitudRoutes";
import trabajadorRoutes from "./trabajadorRoutes";
import usuarioRoutes from "./usuarioRoutes";

const router = Router();

// Los middlewares verificarToken / permitirRoles aun NO se aplican a estas rutas
// (salvo GET /auth/me). Ver docs/MIDDLEWARES.md para activarlos.
router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/clientes", clienteRoutes);
router.use("/trabajadores", trabajadorRoutes);
router.use("/productos", productoRoutes);
router.use("/servicios", servicioRoutes);
router.use("/compras", compraRoutes);
router.use("/solicitudes", solicitudRoutes);

// Ruta para comprobar el estado de la API
router.get("/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

export default router;
