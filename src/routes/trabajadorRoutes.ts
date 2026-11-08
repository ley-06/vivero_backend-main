import { Router } from "express";
import {
    createTrabajador,
    deleteTrabajador,
    getTrabajadorById,
    getTrabajadores,
    updateTrabajador
} from "../controllers/trabajadorController";
import { validarBody } from "../validators/joi";
import { actualizarTrabajadorSchema, crearTrabajadorSchema } from "../validators/trabajador";

const router = Router();

router.get("/", getTrabajadores);
router.get("/:id", getTrabajadorById);
router.post("/", validarBody(crearTrabajadorSchema), createTrabajador);
router.put("/:id", validarBody(actualizarTrabajadorSchema), updateTrabajador);
router.delete("/:id", deleteTrabajador);

export default router;
