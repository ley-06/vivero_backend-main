import Joi from "./joi";
import { ESTADOS_SOLICITUD } from "../models/solicitud";

const texto = (max: number, etiqueta: string) =>
    Joi.string().trim().max(max).allow(null, "").label(etiqueta);
const ci = (etiqueta: string) =>
    Joi.string().trim().pattern(/^\d{11}$/).allow(null, "").label(etiqueta);
const id = (etiqueta: string) => Joi.number().integer().positive().label(etiqueta);

const camposOpcionales = {
    id_usuario: id("El usuario").allow(null),
    id_compra: id("La compra").allow(null),
    id_trabajador: id("El trabajador").allow(null),
    estado: Joi.string().valid(...ESTADOS_SOLICITUD).label("El estado"),
    municipio: texto(50, "El municipio"),
    nombre_destinatario: texto(150, "El nombre del destinatario"),
    ci_destinatario: ci("El CI del destinatario"),
    telefono_destinatario: texto(20, "El telefono del destinatario"),
    direccion_servicio: texto(255, "La direccion del servicio"),
    nombre_cliente: texto(60, "El nombre del cliente"),
    apellidos_cliente: texto(100, "Los apellidos del cliente"),
    ci_cliente: ci("El CI del cliente"),
    telefono_cliente: texto(20, "El telefono del cliente"),
    direccion_cliente: texto(255, "La direccion del cliente"),
    fecha_programada: Joi.date().iso().allow(null).label("La fecha programada")
};

export const crearSolicitudSchema = Joi.object({
    ...camposOpcionales,
    id_servicio: id("El servicio").required()
});

export const actualizarSolicitudSchema = Joi.object({
    ...camposOpcionales,
    id_servicio: id("El servicio")
}).min(1);
