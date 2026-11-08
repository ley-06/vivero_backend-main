import { Request, Response } from "express";
import { creado, ok } from "../helpers/respuesta";
import { idParam } from "../helpers/validar";
import * as trabajadorService from "../services/trabajadorService";

// GET /api/trabajadores
export const getTrabajadores = async (_req: Request, res: Response): Promise<void> => {
    const trabajadores = await trabajadorService.listar();

    ok(res, { total: trabajadores.length, trabajadores });
};

// GET /api/trabajadores/:id
export const getTrabajadorById = async (req: Request, res: Response): Promise<void> => {
    ok(res, { trabajador: await trabajadorService.obtener(idParam(req)) });
};

// POST /api/trabajadores
export const createTrabajador = async (req: Request, res: Response): Promise<void> => {
    const trabajador = await trabajadorService.crear(req.body);

    creado(res, { message: "Trabajador creado correctamente", trabajador });
};

// PUT /api/trabajadores/:id
export const updateTrabajador = async (req: Request, res: Response): Promise<void> => {
    const trabajador = await trabajadorService.actualizar(idParam(req), req.body);

    ok(res, { message: "Trabajador actualizado correctamente", trabajador });
};

// DELETE /api/trabajadores/:id
export const deleteTrabajador = async (req: Request, res: Response): Promise<void> => {
    await trabajadorService.eliminar(idParam(req));

    ok(res, { message: "Trabajador eliminado correctamente" });
};
