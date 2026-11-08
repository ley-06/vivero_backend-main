import AppError from "../helpers/AppError";
import { vacioANulo } from "../helpers/validar";
import { Trabajador, Usuario } from "../models";
import * as usuarioService from "./usuarioService";

const incluirUsuario = [{ model: Usuario, as: "usuario" }];

export const listar = () =>
    Trabajador.findAll({ include: incluirUsuario, order: [["id_trabajador", "ASC"]] });

export const obtener = async (id: number) => {
    const trabajador = await Trabajador.findByPk(id, { include: incluirUsuario });

    if (!trabajador) throw AppError.notFound("Trabajador no encontrado");

    return trabajador;
};

// Crea usuario (rol trabajador) + ficha de trabajador.
export const crear = async (datos: Omit<usuarioService.DatosCrearUsuario, "rol">) => {
    const usuario = await usuarioService.crear({ ...datos, rol: "trabajador" });

    return obtener(usuario.trabajador!.id_trabajador);
};

export const actualizar = async (
    id: number,
    datos: {
        especialidad?: string | null;
        salario_mensual?: number | null;
        salario_final?: number | null;
    }
) => {
    const trabajador = await obtener(id);

    await trabajador.update(vacioANulo(datos));

    return obtener(id);
};

// Elimina el usuario asociado (la ficha se borra en cascada).
// Las compras/solicitudes asignadas quedan sin trabajador (ON DELETE SET NULL).
export const eliminar = async (id: number): Promise<void> => {
    const trabajador = await obtener(id);

    await usuarioService.eliminar(trabajador.id_usuario);
};
