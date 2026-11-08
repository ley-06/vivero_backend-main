import { Request, Response } from "express";
import { creado, ok } from "../helpers/respuesta";
import { idParam } from "../helpers/validar";
import * as solicitudService from "../services/solicitudService";

// GET /api/solicitudes?estado=pendiente&id_usuario=6
export const getSolicitudes = async (req: Request, res: Response): Promise<void> => {
    const solicitudes = await solicitudService.listar(req.query);

    ok(res, { total: solicitudes.length, solicitudes });
};

// GET /api/solicitudes/:id
export const getSolicitudById = async (req: Request, res: Response): Promise<void> => {
    ok(res, { solicitud: await solicitudService.obtener(idParam(req)) });
};

// POST /api/solicitudes
export const createSolicitud = async (req: Request, res: Response): Promise<void> => {
    const solicitud = await solicitudService.crear(req.body);

    creado(res, { message: "Solicitud registrada correctamente", solicitud });
};

// PUT /api/solicitudes/:id
export const updateSolicitud = async (req: Request, res: Response): Promise<void> => {
    const solicitud = await solicitudService.actualizar(idParam(req), req.body);

    ok(res, { message: "Solicitud actualizada correctamente", solicitud });
};

// DELETE /api/solicitudes/:id
export const deleteSolicitud = async (req: Request, res: Response): Promise<void> => {
    await solicitudService.eliminar(idParam(req));

    ok(res, { message: "Solicitud eliminada correctamente" });
};
