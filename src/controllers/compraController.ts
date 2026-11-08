import { Request, Response } from "express";
import { creado, ok } from "../helpers/respuesta";
import { idParam } from "../helpers/validar";
import * as compraService from "../services/compraService";

// GET /api/compras?estado=pendiente&id_usuario=6
export const getCompras = async (req: Request, res: Response): Promise<void> => {
    const compras = await compraService.listar(req.query);

    ok(res, { total: compras.length, compras });
};

// GET /api/compras/:id
export const getCompraById = async (req: Request, res: Response): Promise<void> => {
    ok(res, { compra: await compraService.obtener(idParam(req)) });
};

// POST /api/compras
export const createCompra = async (req: Request, res: Response): Promise<void> => {
    const compra = await compraService.crear(req.body);

    creado(res, { message: "Compra registrada correctamente", compra });
};

// PUT /api/compras/:id
export const updateCompra = async (req: Request, res: Response): Promise<void> => {
    const compra = await compraService.actualizar(idParam(req), req.body);

    ok(res, { message: "Compra actualizada correctamente", compra });
};

// DELETE /api/compras/:id
export const deleteCompra = async (req: Request, res: Response): Promise<void> => {
    await compraService.eliminar(idParam(req));

    ok(res, { message: "Compra eliminada correctamente" });
};
