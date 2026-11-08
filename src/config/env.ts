import dotenv from "dotenv";
import path from "path";

// Unico lugar donde se carga el .env. El resto del proyecto importa `env`.
dotenv.config({ quiet: true });

const requerida = (nombre: string): string => {
    const valor = process.env[nombre];

    if (!valor || !valor.trim()) {
        throw new Error(
            `Falta la variable de entorno obligatoria ${nombre}. Revisa tu archivo .env (ver .env.example).`
        );
    }

    return valor.trim();
};

const numero = (nombre: string, porDefecto: number): number => {
    const valor = process.env[nombre];

    if (valor === undefined || valor.trim() === "") {
        return porDefecto;
    }

    const n = Number(valor);

    if (!Number.isFinite(n) || n <= 0) {
        throw new Error(`La variable de entorno ${nombre} debe ser un numero positivo.`);
    }

    return n;
};

const NODE_ENV = process.env.NODE_ENV || "development";
const JWT_SECRET = requerida("JWT_SECRET");

if (NODE_ENV === "production" && JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET debe tener al menos 32 caracteres en produccion.");
}

const CORS_ORIGIN = (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

export const env = {
    NODE_ENV,
    esProduccion: NODE_ENV === "production",
    PORT: numero("PORT", 3001),

    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: numero("DB_PORT", 5432),
    DB_NAME: process.env.DB_NAME || "vivero",
    DB_USER: process.env.DB_USER || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
    // true = imprime cada consulta SQL en consola (util para depurar)
    DB_LOGGING: process.env.DB_LOGGING === "true",

    JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    BCRYPT_ROUNDS: numero("BCRYPT_ROUNDS", 10),

    // Ruta absoluta de la carpeta de subidas (relativa a la raiz del proyecto).
    UPLOAD_DIR: path.resolve(process.cwd(), process.env.UPLOAD_DIR || "public/uploads"),
    MAX_FILE_SIZE_BYTES: numero("MAX_FILE_SIZE_MB", 5) * 1024 * 1024,

    CORS_ORIGIN
};

export default env;
