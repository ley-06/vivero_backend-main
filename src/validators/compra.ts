import Joi from "./joi";
import { ESTADOS_COMPRA } from "../models/compra";

// POST /compras -> cabecera + lineas. El total se calcula en el servidor.
export const crearCompraSchema = Joi.object({
    id_usuario: Joi.number().integer().positive().required().label("El usuario"),
    id_trabajador: Joi.number().integer().positive().allow(null).label("El trabajador"),
    estado: Joi.string().valid(...ESTADOS_COMPRA).label("El estado"),
    items: Joi.array()
        .items(
            Joi.object({
                id_producto: Joi.number().integer().positive().required().label("El producto"),
                cantidad: Joi.number().integer().positive().default(1).label("La cantidad")
            })
        )
        .min(1)
        .required()
        .label("Los items")
});

// PUT /compras/:id -> solo estado y trabajador asignado
export const actualizarCompraSchema = Joi.object({
    estado: Joi.string().valid(...ESTADOS_COMPRA).label("El estado"),
    id_trabajador: Joi.number().integer().positive().allow(null).label("El trabajador")
}).min(1);
