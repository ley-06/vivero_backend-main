import { InferAttributes } from "sequelize";
import AppError from "../helpers/AppError";
import { queryEntero, queryTexto, vacioANulo } from "../helpers/validar";
import { Compra, Servicio, Solicitud, Trabajador, Usuario } from "../models";

type DatosSolicitud = Partial<
    Omit<InferAttributes<Solicitud>, "id_solicitud" | "fecha_gestion" | "fecha_programada">
> & { fecha_programada?: string | Date | null };

const incluirTodo = [
    { model: Servicio, as: "servicio" },
    { model: Usuario, as: "usuario" },
    { model: Trabajador, as: "trabajador" },
    { model: Compra, as: "compra", attributes: ["id_compra", "estado", "total"] }
];

export const listar = (query: Record<string, unknown> = {}) => {
    const where: Record<string, unknown> = {};
    const estado = queryTexto(query.estado);
    const idUsuario = queryEntero(query.id_usuario);
    const idTrabajador = queryEntero(query.id_trabajador);
    const idServicio = queryEntero(query.id_servicio);

    if (estado) where.estado = estado;
    if (idUsuario) where.id_usuario = idUsuario;
    if (idTrabajador) where.id_trabajador = idTrabajador;
    if (idServicio) where.id_servicio = idServicio;

    return Solicitud.findAll({
        where,
        include: incluirTodo,
        order: [["id_solicitud", "DESC"]]
    });
};

export const obtener = async (id: number) => {
    const solicitud = await Solicitud.findByPk(id, { include: incluirTodo });

    if (!solicitud) throw AppError.notFound("Solicitud no encontrada");

    return solicitud;
};

// Comprueba que los IDs relacionados existan para devolver un mensaje claro.
const validarReferencias = async (d: DatosSolicitud): Promise<void> => {
    if (d.id_servicio !== undefined) {
        const servicio = await Servicio.findByPk(d.id_servicio);
        if (!servicio) throw AppError.badRequest("El servicio indicado no existe");
        if (!servicio.activo) throw AppError.badRequest("El servicio indicado no esta disponible");
    }

    if (d.id_usuario) {
        if (!(await Usuario.findByPk(d.id_usuario))) throw AppError.badRequest("El usuario indicado no existe");
    }

    if (d.id_compra) {
        if (!(await Compra.findByPk(d.id_compra))) throw AppError.badRequest("La compra indicada no existe");
    }

    if (d.id_trabajador) {
        if (!(await Trabajador.findByPk(d.id_trabajador))) throw AppError.badRequest("El trabajador indicado no existe");
    }
};

export const crear = async (datos: DatosSolicitud & { id_servicio: number }) => {
    const d = vacioANulo(datos);

    await validarReferencias(d);

    const solicitud = await Solicitud.create({
        id_usuario: null,
        id_compra: null,
        id_trabajador: null,
        estado: "pendiente",
        municipio: null,
        nombre_destinatario: null,
        ci_destinatario: null,
        telefono_destinatario: null,
        direccion_servicio: null,
        nombre_cliente: null,
        apellidos_cliente: null,
        ci_cliente: null,
        telefono_cliente: null,
        direccion_cliente: null,
        ...d,
        fecha_programada: d.fecha_programada ? new Date(d.fecha_programada).toISOString().slice(0, 10) : null
    });

    return obtener(solicitud.id_solicitud);
};

export const actualizar = async (id: number, datos: DatosSolicitud) => {
    const solicitud = await obtener(id);
    const d = vacioANulo(datos);

    await validarReferencias(d);

    const { fecha_programada, ...resto } = d;

    await solicitud.update({
        ...resto,
        ...(fecha_programada !== undefined && {
            fecha_programada: fecha_programada ? new Date(fecha_programada).toISOString().slice(0, 10) : null
        })
    });

    return obtener(id);
};

export const eliminar = async (id: number): Promise<void> => {
    const solicitud = await obtener(id);

    await solicitud.destroy();
};
