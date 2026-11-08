import Joi from "./joi";
import { camposCliente, camposUsuarioCrear } from "./usuario";

// POST /auth/register -> siempre crea un cliente (el rol se fija en el service)
export const registroSchema = Joi.object({
    ...camposUsuarioCrear,
    ...camposCliente
});

// POST /auth/login
export const loginSchema = Joi.object({
    usuario: Joi.string().trim().required().label("El usuario"),
    contrasena: Joi.string().required().label("La contrasena")
});
