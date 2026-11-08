import Joi from "./joi";
import { ROLES } from "../models/usuario";

const nombre = Joi.string().trim().max(60).label("El nombre");
const apellidos = Joi.string().trim().max(100).label("Los apellidos");
const usuario = Joi.string().trim().min(3).max(50).label("El usuario");
const contrasena = Joi.string().min(8).max(72).label("La contrasena");
const telefono = Joi.string().trim().max(20).allow(null, "").label("El telefono");
const ci = Joi.string().trim().pattern(/^\d{11}$/).allow(null, "").label("El CI");

// Campos compartidos por usuarios, clientes y trabajadores al crear.
export const camposUsuarioCrear = {
    nombre: nombre.required(),
    apellidos: apellidos.required(),
    usuario: usuario.required(),
    contrasena: contrasena.required(),
    telefono
};

export const camposCliente = {
    ci,
    direccion: Joi.string().trim().max(255).allow(null, "").label("La direccion")
};

export const camposTrabajador = {
    especialidad: Joi.string().trim().max(100).allow(null, "").label("La especialidad"),
    salario_mensual: Joi.number().min(0).precision(2).allow(null).label("El salario mensual"),
    salario_final: Joi.number().min(0).precision(2).allow(null).label("El salario final")
};

// POST /usuarios -> rol opcional (por defecto cliente); datos de cliente/trabajador opcionales.
export const crearUsuarioSchema = Joi.object({
    ...camposUsuarioCrear,
    rol: Joi.string().valid(...ROLES).default("cliente").label("El rol"),
    ...camposCliente,
    ...camposTrabajador
});

// PUT /usuarios/:id (el rol no se cambia aqui)
export const actualizarUsuarioSchema = Joi.object({
    nombre,
    apellidos,
    usuario,
    contrasena,
    telefono
}).min(1);
