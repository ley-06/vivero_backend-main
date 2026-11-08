import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/AppError";
import { TokenPayload, verificarJwt } from "../helpers/jwt";

// Anade req.auth con los datos del token (id_usuario y rol).
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            auth?: TokenPayload;
        }
    }
}

// Exige un JWT valido en la cabecera:  Authorization: Bearer <token>
// NO esta aplicado a ninguna ruta todavia. Ver docs/MIDDLEWARES.md.
export const verificarToken = (req: Request, _res: Response, next: NextFunction): void => {
    const cabecera = req.headers.authorization;

    if (!cabecera || !cabecera.startsWith("Bearer ")) {
        next(AppError.unauthorized("Debes iniciar sesion (falta el token Bearer)"));
        return;
    }

    try {
        req.auth = verificarJwt(cabecera.slice(7).trim());
        next();
    } catch (error) {
        next(error);
    }
};

export default verificarToken;
