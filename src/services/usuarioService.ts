import { Transaction } from "sequelize";
import sequelize from "../config/basedatos";
import AppError from "../helpers/AppError";
import { hashPassword } from "../helpers/hash";
import { vacioANulo } from "../helpers/validar";
import { Cliente, Trabajador, Usuario } from "../models";
import { RolUsuario } from "../models/usuario";

export interface DatosCrearUsuario {
    nombre: string;
    apellidos: string;
    usuario: string;
    contrasena: string;
    telefono?: string | null;
    rol?: RolUsuario;
    // ficha de cliente
    ci?: string | null;
    direccion?: string | null;
    // ficha de trabajador
    especialidad?: string | null;
    salario_mensual?: number | null;
    salario_final?: number | null;
}

export interface DatosActualizarUsuario {
    nombre?: string;
    apellidos?: string;
    usuario?: string;
    contrasena?: string;
    telefono?: string | null;
}

const incluirFichas = [
    { model: Cliente, as: "cliente" },
    { model: Trabajador, as: "trabajador" }
];

export const listar = () =>
    Usuario.findAll({ include: incluirFichas, order: [["id_usuario", "ASC"]] });

export const obtener = async (id: number) => {
    const usuario = await Usuario.findByPk(id, { include: incluirFichas });

    if (!usuario) throw AppError.notFound("Usuario no encontrado");

    return usuario;
};

const comprobarUsuarioLibre = async (nombreUsuario: string, ignorarId?: number) => {
    const existente = await Usuario.findOne({ where: { usuario: nombreUsuario } });

    if (existente && existente.id_usuario !== ignorarId) {
        throw AppError.conflict("Ese nombre de usuario ya esta registrado");
    }
};

// Crea el usuario y, segun su rol, su ficha (cliente / trabajador) en una transaccion.
export const crear = async (datos: DatosCrearUsuario) => {
    const rol: RolUsuario = datos.rol ?? "cliente";
    const d = vacioANulo(datos);

    await comprobarUsuarioLibre(d.usuario);

    const contrasena = await hashPassword(d.contrasena);

    const id = await sequelize.transaction(async (t: Transaction) => {
        const usuario = await Usuario.create(
            {
                nombre: d.nombre,
                apellidos: d.apellidos,
                usuario: d.usuario,
                contrasena,
                rol,
                telefono: d.telefono ?? null
            },
            { transaction: t }
        );

        if (rol === "cliente") {
            await Cliente.create(
                { id_usuario: usuario.id_usuario, ci: d.ci ?? null, direccion: d.direccion ?? null },
                { transaction: t }
            );
        }

        if (rol === "trabajador") {
            await Trabajador.create(
                {
                    id_usuario: usuario.id_usuario,
                    especialidad: d.especialidad ?? null,
                    salario_mensual: d.salario_mensual ?? null,
                    salario_final: d.salario_final ?? null
                },
                { transaction: t }
            );
        }

        return usuario.id_usuario;
    });

    return obtener(id);
};

export const actualizar = async (id: number, datos: DatosActualizarUsuario) => {
    const usuario = await Usuario.scope("conContrasena").findByPk(id);

    if (!usuario) throw AppError.notFound("Usuario no encontrado");

    const d = vacioANulo(datos);

    if (d.usuario !== undefined) {
        await comprobarUsuarioLibre(d.usuario, id);
        usuario.usuario = d.usuario;
    }

    if (d.nombre !== undefined) usuario.nombre = d.nombre;
    if (d.apellidos !== undefined) usuario.apellidos = d.apellidos;
    if (d.telefono !== undefined) usuario.telefono = d.telefono;
    if (d.contrasena !== undefined) usuario.contrasena = await hashPassword(d.contrasena);

    await usuario.save();

    return obtener(id);
};

export const eliminar = async (id: number): Promise<void> => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) throw AppError.notFound("Usuario no encontrado");

    // cliente/trabajador se eliminan en cascada; compras y solicitudes lo impiden (409).
    await usuario.destroy();
};
