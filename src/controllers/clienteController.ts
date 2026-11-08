import { Request, Response } from "express";
import { creado, ok } from "../helpers/respuesta";
import { idParam } from "../helpers/validar";
import * as clienteService from "../services/clienteService";

// GET /api/clientes
export const getClientes = async (_req: Request, res: Response): Promise<void> => {
    const clientes = await clienteService.listar();

    ok(res, { total: clientes.length, clientes });
};

// GET /api/clientes/:id
export const getClienteById = async (req: Request, res: Response): Promise<void> => {
    ok(res, { cliente: await clienteService.obtener(idParam(req)) });
};

// POST /api/clientes
export const createCliente = async (req: Request, res: Response): Promise<void> => {
    const cliente = await clienteService.crear(req.body);

    creado(res, { message: "Cliente creado correctamente", cliente });
};

// PUT /api/clientes/:id
export const updateCliente = async (req: Request, res: Response): Promise<void> => {
    const cliente = await clienteService.actualizar(idParam(req), req.body);

    ok(res, { message: "Cliente actualizado correctamente", cliente });
};

// DELETE /api/clientes/:id
export const deleteCliente = async (req: Request, res: Response): Promise<void> => {
    await clienteService.eliminar(idParam(req));

    ok(res, { message: "Cliente eliminado correctamente" });
};
