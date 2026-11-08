import BaseJoi, { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/AppError";

// Joi configurado para la API:
//  - stripUnknown: los campos no declarados se descartan (evita asignaciones masivas)
//  - abortEarly=false: se devuelven todos los errores de una vez
//  - mensajes en espanol
const Joi = BaseJoi.defaults((schema) =>
    schema.options({
        abortEarly: false,
        stripUnknown: true,
        convert: true,
        errors: { wrap: { label: false } },
        messages: {
            "any.required": "Falta un dato obligatorio: {{#label}}",
            "any.only": "{{#label}} no tiene un valor valido",
            "any.invalid": "{{#label}} no es valido",
            "object.min": "Debes enviar al menos un campo para actualizar",
            "object.base": "{{#label}} debe ser un objeto",
            "string.base": "{{#label}} debe ser texto",
            "string.empty": "{{#label}} no puede estar vacio",
            "string.min": "{{#label}} debe tener al menos {{#limit}} caracteres",
            "string.max": "{{#label}} no puede superar {{#limit}} caracteres",
            "string.pattern.base": "{{#label}} no tiene un formato valido",
            "number.base": "{{#label}} debe ser un numero",
            "number.integer": "{{#label}} debe ser un numero entero",
            "number.min": "{{#label}} debe ser como minimo {{#limit}}",
            "number.positive": "{{#label}} debe ser mayor que 0",
            "boolean.base": "{{#label}} debe ser verdadero o falso",
            "date.base": "{{#label}} debe ser una fecha valida",
            "date.format": "{{#label}} debe tener formato AAAA-MM-DD",
            "array.base": "{{#label}} debe ser una lista",
            "array.min": "{{#label}} debe tener al menos {{#limit}} elemento(s)"
        }
    })
);

// Middleware de ruta: valida y reemplaza req.body por el valor limpio.
export const validarBody =
    (schema: ObjectSchema) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.body ?? {});

        if (error) {
            next(AppError.badRequest(error.details.map((d) => d.message).join("; ")));
            return;
        }

        req.body = value;
        next();
    };

export default Joi;
