import { Router } from "express";
import {
    createUsuario,
    deleteUsuario,
    getUsuarioById,
    getUsuarios,
    updateUsuario
} from "../controllers/usuarioController";
import { validarBody } from "../validators/joi";
import { actualizarUsuarioSchema, crearUsuarioSchema } from "../validators/usuario";

const router = Router();

// route -> (validacion) -> controller -> service

router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.post("/", validarBody(crearUsuarioSchema), createUsuario);
router.put("/:id", validarBody(actualizarUsuarioSchema), updateUsuario);
router.delete("/:id", deleteUsuario);

export default router;
