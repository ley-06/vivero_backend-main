import { Request, Response } from "express";
import { creado, ok } from "../helpers/respuesta";
import { idParam } from "../helpers/validar";
import * as usuarioService from "../services/usuarioService";

// El controller solo traduce HTTP <-> service. La logica esta en usuarioService.

// GET /api/usuarios
export const getUsuarios = async (_req: Request, res: Response): Promise<void> => {
    const usuarios = await usuarioService.listar();

    ok(res, { total: usuarios.length, usuarios });
};

// GET /api/usuarios/:id
export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
    const usuario = await usuarioService.obtener(idParam(req));

    ok(res, { usuario });
};

// POST /api/usuarios
export const createUsuario = async (req: Request, res: Response): Promise<void> => {
    const usuario = await usuarioService.crear(req.body);

    creado(res, { message: "Usuario registrado correctamente", usuario });
};

// PUT /api/usuarios/:id
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
    const usuario = await usuarioService.actualizar(idParam(req), req.body);

    ok(res, { message: "Usuario actualizado correctamente", usuario });
};

// DELETE /api/usuarios/:id
export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
    await usuarioService.eliminar(idParam(req));

    ok(res, { message: "Usuario eliminado correctamente" });
};
