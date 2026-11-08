import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env";
import AppError from "./AppError";

export type Rol = "administrador" | "trabajador" | "cliente";

export interface TokenPayload {
    id_usuario: number;
    rol: Rol;
}

export const firmarToken = (payload: TokenPayload): string =>
    jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    });

export const verificarJwt = (token: string): TokenPayload => {
    let decoded: string | jwt.JwtPayload;

    try {
        decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw AppError.unauthorized("El token ha expirado");
        }

        throw AppError.unauthorized("Token invalido");
    }

    if (
        typeof decoded === "string" ||
        typeof decoded.id_usuario !== "number" ||
        typeof decoded.rol !== "string"
    ) {
        throw AppError.unauthorized("Token invalido");
    }

    return { id_usuario: decoded.id_usuario, rol: decoded.rol as Rol };
};
