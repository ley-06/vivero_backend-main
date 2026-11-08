import { Router } from "express";
import {
    createSolicitud,
    deleteSolicitud,
    getSolicitudById,
    getSolicitudes,
    updateSolicitud
} from "../controllers/solicitudController";
import { validarBody } from "../validators/joi";
import { actualizarSolicitudSchema, crearSolicitudSchema } from "../validators/solicitud";

const router = Router();

router.get("/", getSolicitudes);
router.get("/:id", getSolicitudById);
router.post("/", validarBody(crearSolicitudSchema), createSolicitud);
router.put("/:id", validarBody(actualizarSolicitudSchema), updateSolicitud);
router.delete("/:id", deleteSolicitud);

export default router;
