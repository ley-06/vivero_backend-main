import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/AppError";
import { Rol } from "../helpers/jwt";

// Restringe una ruta a ciertos roles. Debe ir DESPUES de verificarToken.
//   router.delete("/:id", verificarToken, permitirRoles("administrador"), handler)
// NO esta aplicado a ninguna ruta todavia. Ver docs/MIDDLEWARES.md.
export const permitirRoles =
    (...roles: Rol[]) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.auth) {
            next(AppError.unauthorized("Debes iniciar sesion"));
            return;
        }

        if (!roles.includes(req.auth.rol)) {
            next(AppError.forbidden());
            return;
        }

        next();
    };

// Permite al propio usuario (por :id) o a los roles indicados.
//   router.put("/:id", verificarToken, propioORoles("administrador"), handler)
export const propioORoles =
    (...roles: Rol[]) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.auth) {
            next(AppError.unauthorized("Debes iniciar sesion"));
            return;
        }

        const esPropio = Number(req.params.id) === req.auth.id_usuario;

        if (!esPropio && !roles.includes(req.auth.rol)) {
            next(AppError.forbidden());
            return;
        }

        next();
    };
