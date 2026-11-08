import { Request, Response } from "express";
import AppError from "../helpers/AppError";
import { creado, ok } from "../helpers/respuesta";
import * as authService from "../services/authService";

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
    const { token, usuario } = await authService.registrar(req.body);

    creado(res, { message: "Usuario registrado correctamente", token, usuario });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { token, usuario } = await authService.login(req.body.usuario, req.body.contrasena);

    ok(res, { message: "Inicio de sesion correcto", token, usuario });
};

// GET /api/auth/me  (requiere el middleware verificarToken: ver docs/MIDDLEWARES.md)
export const me = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw AppError.unauthorized("Debes iniciar sesion");

    ok(res, { usuario: await authService.perfil(req.auth.id_usuario) });
};
