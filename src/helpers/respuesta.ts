import { Response } from "express";

// Formato comun de respuestas: { status: "success", ... }
export const ok = (res: Response, datos: Record<string, unknown> = {}, codigo = 200): void => {
    res.status(codigo).json({ status: "success", ...datos });
};

export const creado = (res: Response, datos: Record<string, unknown> = {}): void => {
    ok(res, datos, 201);
};
