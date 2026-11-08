import { Router } from "express";
import {
    createCliente,
    deleteCliente,
    getClienteById,
    getClientes,
    updateCliente
} from "../controllers/clienteController";
import { actualizarClienteSchema, crearClienteSchema } from "../validators/cliente";
import { validarBody } from "../validators/joi";

const router = Router();

router.get("/", getClientes);
router.get("/:id", getClienteById);
router.post("/", validarBody(crearClienteSchema), createCliente);
router.put("/:id", validarBody(actualizarClienteSchema), updateCliente);
router.delete("/:id", deleteCliente);

export default router;
