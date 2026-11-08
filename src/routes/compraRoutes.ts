import { Router } from "express";
import {
    createCompra,
    deleteCompra,
    getCompraById,
    getCompras,
    updateCompra
} from "../controllers/compraController";
import { actualizarCompraSchema, crearCompraSchema } from "../validators/compra";
import { validarBody } from "../validators/joi";

const router = Router();

router.get("/", getCompras);
router.get("/:id", getCompraById);
router.post("/", validarBody(crearCompraSchema), createCompra);
router.put("/:id", validarBody(actualizarCompraSchema), updateCompra);
router.delete("/:id", deleteCompra);

export default router;
