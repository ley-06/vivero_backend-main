import AppError from "../helpers/AppError";
import { vacioANulo } from "../helpers/validar";
import { Cliente, Usuario } from "../models";
import * as usuarioService from "./usuarioService";

const incluirUsuario = [{ model: Usuario, as: "usuario" }];

export const listar = () =>
    Cliente.findAll({ include: incluirUsuario, order: [["id_cliente", "ASC"]] });

export const obtener = async (id: number) => {
    const cliente = await Cliente.findByPk(id, { include: incluirUsuario });

    if (!cliente) throw AppError.notFound("Cliente no encontrado");

    return cliente;
};

// Crea usuario (rol cliente) + ficha de cliente.
export const crear = async (datos: Omit<usuarioService.DatosCrearUsuario, "rol">) => {
    const usuario = await usuarioService.crear({ ...datos, rol: "cliente" });

    return obtener(usuario.cliente!.id_cliente);
};

export const actualizar = async (
    id: number,
    datos: { ci?: string | null; direccion?: string | null }
) => {
    const cliente = await obtener(id);

    await cliente.update(vacioANulo(datos));

    return obtener(id);
};

// Elimina el usuario asociado (la ficha se borra en cascada).
export const eliminar = async (id: number): Promise<void> => {
    const cliente = await obtener(id);

    await usuarioService.eliminar(cliente.id_usuario);
};
