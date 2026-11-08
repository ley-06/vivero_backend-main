import { Request, Response } from "express";
import { creado, ok } from "../helpers/respuesta";
import { idParam } from "../helpers/validar";
import * as productoService from "../services/productoService";

// GET /api/productos?tipo=planta&activo=true
export const getProductos = async (req: Request, res: Response): Promise<void> => {
    const productos = await productoService.listar(req.query);

    ok(res, { total: productos.length, productos });
};

// GET /api/productos/:id
export const getProductoById = async (req: Request, res: Response): Promise<void> => {
    ok(res, { producto: await productoService.obtener(idParam(req)) });
};

// POST /api/productos
export const createProducto = async (req: Request, res: Response): Promise<void> => {
    const producto = await productoService.crear(req.body);

    creado(res, { message: "Producto creado correctamente", producto });
};

// PUT /api/productos/:id
export const updateProducto = async (req: Request, res: Response): Promise<void> => {
    const producto = await productoService.actualizar(idParam(req), req.body);

    ok(res, { message: "Producto actualizado correctamente", producto });
};

// DELETE /api/productos/:id
export const deleteProducto = async (req: Request, res: Response): Promise<void> => {
    await productoService.eliminar(idParam(req));

    ok(res, { message: "Producto eliminado correctamente" });
};

// POST /api/productos/:id/imagen  (multipart/form-data, campo "imagen")
export const uploadImagenProducto = async (req: Request, res: Response): Promise<void> => {
    const producto = await productoService.guardarImagen(idParam(req), req.file);

    ok(res, { message: "Imagen guardada correctamente", producto });
};

// DELETE /api/productos/:id/imagen
export const deleteImagenProducto = async (req: Request, res: Response): Promise<void> => {
    const producto = await productoService.quitarImagen(idParam(req));

    ok(res, { message: "Imagen eliminada correctamente", producto });
};
