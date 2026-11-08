import { Router } from "express";
import {
    createProducto,
    deleteImagenProducto,
    deleteProducto,
    getProductoById,
    getProductos,
    updateProducto,
    uploadImagenProducto
} from "../controllers/productoController";
import { subirImagenProducto } from "../middlewares/upload";
import { validarBody } from "../validators/joi";
import { actualizarProductoSchema, crearProductoSchema } from "../validators/producto";

const router = Router();

router.get("/", getProductos);
router.get("/:id", getProductoById);
router.post("/", validarBody(crearProductoSchema), createProducto);
router.put("/:id", validarBody(actualizarProductoSchema), updateProducto);
router.delete("/:id", deleteProducto);

// Imagen: multipart/form-data con el campo "imagen" (jpg, png o webp)
router.post("/:id/imagen", subirImagenProducto, uploadImagenProducto);
router.delete("/:id/imagen", deleteImagenProducto);

export default router;
