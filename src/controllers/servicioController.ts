import { Request, Response } from "express";
import { creado, ok } from "../helpers/respuesta";
import { idParam } from "../helpers/validar";
import * as servicioService from "../services/servicioService";

// GET /api/servicios?tipo=entrega&activo=true
export const getServicios = async (req: Request, res: Response): Promise<void> => {
    const servicios = await servicioService.listar(req.query);

    ok(res, { total: servicios.length, servicios });
};

// GET /api/servicios/:id
export const getServicioById = async (req: Request, res: Response): Promise<void> => {
    ok(res, { servicio: await servicioService.obtener(idParam(req)) });
};

// POST /api/servicios
export const createServicio = async (req: Request, res: Response): Promise<void> => {
    const servicio = await servicioService.crear(req.body);

    creado(res, { message: "Servicio creado correctamente", servicio });
};

// PUT /api/servicios/:id
export const updateServicio = async (req: Request, res: Response): Promise<void> => {
    const servicio = await servicioService.actualizar(idParam(req), req.body);

    ok(res, { message: "Servicio actualizado correctamente", servicio });
};

// DELETE /api/servicios/:id
export const deleteServicio = async (req: Request, res: Response): Promise<void> => {
    await servicioService.eliminar(idParam(req));

    ok(res, { message: "Servicio eliminado correctamente" });
};
