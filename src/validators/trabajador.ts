import Joi from "./joi";
import { camposTrabajador, camposUsuarioCrear } from "./usuario";

// POST /trabajadores -> crea el usuario (rol trabajador) y su ficha de trabajador
export const crearTrabajadorSchema = Joi.object({
    ...camposUsuarioCrear,
    ...camposTrabajador
});

// PUT /trabajadores/:id -> solo datos de la ficha de trabajador
export const actualizarTrabajadorSchema = Joi.object({
    ...camposTrabajador
}).min(1);
