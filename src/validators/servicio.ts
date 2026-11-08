import Joi from "./joi";

export const crearServicioSchema = Joi.object({
    nombre: Joi.string().trim().max(150).required().label("El nombre"),
    descripcion: Joi.string().trim().allow(null, "").label("La descripcion"),
    costo: Joi.number().min(0).precision(2).required().label("El costo"),
    tipo: Joi.string().trim().max(50).allow(null, "").label("El tipo"),
    activo: Joi.boolean().label("El campo activo")
});

export const actualizarServicioSchema = Joi.object({
    nombre: Joi.string().trim().max(150).label("El nombre"),
    descripcion: Joi.string().trim().allow(null, "").label("La descripcion"),
    costo: Joi.number().min(0).precision(2).label("El costo"),
    tipo: Joi.string().trim().max(50).allow(null, "").label("El tipo"),
    activo: Joi.boolean().label("El campo activo")
}).min(1);
