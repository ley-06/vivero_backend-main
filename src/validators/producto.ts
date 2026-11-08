import Joi from "./joi";
import { TIPOS_PRODUCTO } from "../models/producto";

const planta = Joi.object({
    ubicacion: Joi.string().trim().max(50).allow(null, ""),
    suelo: Joi.string().trim().max(50).allow(null, ""),
    riego: Joi.string().trim().max(50).allow(null, ""),
    area: Joi.string().trim().max(30).allow(null, ""),
    proposito: Joi.string().trim().max(50).allow(null, "")
}).label("Los datos de la planta");

const accesorio = Joi.object({
    tamano: Joi.string().trim().max(50).allow(null, "")
}).label("Los datos del accesorio");

// POST /productos
// Segun "tipo" se usa el bloque "planta" o "accesorio".
export const crearProductoSchema = Joi.object({
    tipo: Joi.string().valid(...TIPOS_PRODUCTO).required().label("El tipo"),
    nombre: Joi.string().trim().max(100).required().label("El nombre"),
    descripcion: Joi.string().trim().allow(null, "").label("La descripcion"),
    precio: Joi.number().min(0).precision(2).required().label("El precio"),
    activo: Joi.boolean().label("El campo activo"),
    planta,
    accesorio
});

// PUT /productos/:id (el tipo no se puede cambiar)
export const actualizarProductoSchema = Joi.object({
    nombre: Joi.string().trim().max(100).label("El nombre"),
    descripcion: Joi.string().trim().allow(null, "").label("La descripcion"),
    precio: Joi.number().min(0).precision(2).label("El precio"),
    activo: Joi.boolean().label("El campo activo"),
    planta,
    accesorio
}).min(1);
