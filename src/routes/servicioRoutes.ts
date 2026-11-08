import { Router } from "express";
import {
    createServicio,
    deleteServicio,
    getServicioById,
    getServicios,
    updateServicio
} from "../controllers/servicioController";
import { validarBody } from "../validators/joi";
import { actualizarServicioSchema, crearServicioSchema } from "../validators/servicio";

const router = Router();

router.get("/", getServicios);
router.get("/:id", getServicioById);
router.post("/", validarBody(crearServicioSchema), createServicio);
router.put("/:id", validarBody(actualizarServicioSchema), updateServicio);
router.delete("/:id", deleteServicio);

export default router;
