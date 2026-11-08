import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import multer from "multer";
import {
    DatabaseError,
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ValidationError
} from "sequelize";
import env from "../config/env";
import AppError from "../helpers/AppError";

// Traduce cualquier error a { statusCode, message }.
const traducir = (error: unknown): { statusCode: number; message: string } => {
    if (error instanceof AppError) {
        return { statusCode: error.statusCode, message: error.message };
    }

    if (error instanceof multer.MulterError) {
        return error.code === "LIMIT_FILE_SIZE"
            ? { statusCode: 413, message: "El archivo supera el tamano maximo permitido" }
            : { statusCode: 400, message: "Error al subir el archivo" };
    }

    if (error instanceof UniqueConstraintError) {
        return { statusCode: 409, message: "Ya existe un registro con esos datos" };
    }

    if (error instanceof ForeignKeyConstraintError) {
        // Insert/update con un ID inexistente  vs  delete de algo que esta en uso
        const detalle = String((error.parent as { detail?: string } | undefined)?.detail ?? "");

        return detalle.includes("is not present")
            ? { statusCode: 400, message: "Alguno de los IDs relacionados no existe" }
            : { statusCode: 409, message: "No se puede eliminar porque tiene registros relacionados" };
    }

    if (error instanceof ValidationError) {
        return { statusCode: 400, message: error.errors.map((e) => e.message).join("; ") };
    }

    // 23514 = check_violation (CHECK de dominios definidos en el SQL)
    if (error instanceof DatabaseError && (error.parent as { code?: string })?.code === "23514") {
        return { statusCode: 400, message: "Algun valor no es valido para ese campo" };
    }

    // JSON mal formado, payload demasiado grande, etc. (errores de body-parser)
    const e = error as { status?: number; statusCode?: number; type?: string; message?: string };
    const http = e?.status ?? e?.statusCode;

    if (typeof http === "number" && http >= 400 && http < 500) {
        return {
            statusCode: http,
            message: e.type === "entity.parse.failed" ? "El cuerpo de la peticion no es un JSON valido" : e.message ?? "Peticion no valida"
        };
    }

    return { statusCode: 500, message: "Error interno del servidor" };
};

const errorHandler: ErrorRequestHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { statusCode, message } = traducir(error);

    if (statusCode >= 500 && env.NODE_ENV !== "test") {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}`, error);
    }

    // Si ya comenzo el envio de la respuesta, dejamos que Express gestione el error.
    if (res.headersSent) {
        next(error);
        return;
    }

    res.status(statusCode).json({ status: "error", message });
};

export default errorHandler;
