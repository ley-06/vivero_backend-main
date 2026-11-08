import Joi from "./joi";
import { camposCliente, camposUsuarioCrear } from "./usuario";

// POST /clientes -> crea el usuario (rol cliente) y su ficha de cliente
export const crearClienteSchema = Joi.object({
    ...camposUsuarioCrear,
    ...camposCliente
});

// PUT /clientes/:id -> solo datos de la ficha de cliente
export const actualizarClienteSchema = Joi.object({
    ...camposCliente
}).min(1);
