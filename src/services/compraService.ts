import { Op, Transaction } from "sequelize";
import sequelize from "../config/basedatos";
import AppError from "../helpers/AppError";
import { queryEntero, queryTexto } from "../helpers/validar";
import { Compra, DetalleCompra, Producto, Trabajador, Usuario } from "../models";
import { EstadoCompra } from "../models/compra";

export interface DatosCrearCompra {
    id_usuario: number;
    id_trabajador?: number | null;
    estado?: EstadoCompra;
    items: { id_producto: number; cantidad: number }[];
}

const incluirTodo = [
    { model: Usuario, as: "usuario" },
    { model: Trabajador, as: "trabajador" },
    {
        model: DetalleCompra,
        as: "detalles",
        include: [{ model: Producto, as: "producto", attributes: ["id_producto", "nombre", "tipo", "precio"] }]
    }
];

export const listar = (query: Record<string, unknown> = {}) => {
    const where: Record<string, unknown> = {};
    const estado = queryTexto(query.estado);
    const idUsuario = queryEntero(query.id_usuario);
    const idTrabajador = queryEntero(query.id_trabajador);

    if (estado) where.estado = estado;
    if (idUsuario) where.id_usuario = idUsuario;
    if (idTrabajador) where.id_trabajador = idTrabajador;

    return Compra.findAll({
        where,
        include: incluirTodo,
        order: [["id_compra", "DESC"]]
    });
};

export const obtener = async (id: number) => {
    const compra = await Compra.findByPk(id, { include: incluirTodo });

    if (!compra) throw AppError.notFound("Compra no encontrada");

    return compra;
};

// Crea la cabecera y sus lineas en una transaccion.
// El total de cada linea es cantidad x precio actual del producto; el total de la
// compra es la suma de sus lineas (el cliente no puede enviar totales).
export const crear = async (datos: DatosCrearCompra) => {
    // Unificar productos repetidos sumando cantidades.
    const cantidades = new Map<number, number>();
    for (const item of datos.items) {
        cantidades.set(item.id_producto, (cantidades.get(item.id_producto) ?? 0) + item.cantidad);
    }

    const id = await sequelize.transaction(async (t: Transaction) => {
        const usuario = await Usuario.findByPk(datos.id_usuario, { transaction: t });
        if (!usuario) throw AppError.badRequest("El usuario indicado no existe");

        if (datos.id_trabajador) {
            const trabajador = await Trabajador.findByPk(datos.id_trabajador, { transaction: t });
            if (!trabajador) throw AppError.badRequest("El trabajador indicado no existe");
        }

        const productos = await Producto.findAll({
            where: { id_producto: { [Op.in]: [...cantidades.keys()] } },
            transaction: t
        });

        if (productos.length !== cantidades.size) {
            throw AppError.badRequest("Alguno de los productos indicados no existe");
        }

        const inactivo = productos.find((p) => !p.activo);
        if (inactivo) {
            throw AppError.badRequest(`El producto "${inactivo.nombre}" no esta disponible`);
        }

        const lineas = productos.map((p) => {
            const cantidad = cantidades.get(p.id_producto)!;
            // Calculo en centavos para evitar errores de coma flotante.
            const total = Math.round(Number(p.precio) * 100) * cantidad / 100;
            return { id_producto: p.id_producto, cantidad, total };
        });

        const total = lineas.reduce((suma, l) => suma + Math.round(l.total * 100), 0) / 100;

        const compra = await Compra.create(
            {
                id_usuario: datos.id_usuario,
                id_trabajador: datos.id_trabajador ?? null,
                estado: datos.estado ?? "pendiente",
                total
            },
            { transaction: t }
        );

        await DetalleCompra.bulkCreate(
            lineas.map((l) => ({ id_compra: compra.id_compra, ...l })),
            { transaction: t }
        );

        return compra.id_compra;
    });

    return obtener(id);
};

export const actualizar = async (
    id: number,
    datos: { estado?: EstadoCompra; id_trabajador?: number | null }
) => {
    const compra = await obtener(id);

    if (datos.id_trabajador) {
        const trabajador = await Trabajador.findByPk(datos.id_trabajador);
        if (!trabajador) throw AppError.badRequest("El trabajador indicado no existe");
    }

    await compra.update(datos);

    return obtener(id);
};

// Elimina la compra y sus lineas (cascada). Las solicitudes vinculadas quedan sin compra.
export const eliminar = async (id: number): Promise<void> => {
    const compra = await obtener(id);

    await compra.destroy();
};
