import AppError from "../helpers/AppError";
import { queryBooleano, queryTexto, vacioANulo } from "../helpers/validar";
import { Servicio } from "../models";

export interface DatosServicio {
    nombre: string;
    descripcion?: string | null;
    costo: number;
    tipo?: string | null;
    activo?: boolean;
}

export const listar = (query: Record<string, unknown> = {}) => {
    const where: Record<string, unknown> = {};
    const tipo = queryTexto(query.tipo);
    const activo = queryBooleano(query.activo);

    if (tipo) where.tipo = tipo;
    if (activo !== undefined) where.activo = activo;

    return Servicio.findAll({ where, order: [["id_servicio", "ASC"]] });
};

export const obtener = async (id: number) => {
    const servicio = await Servicio.findByPk(id);

    if (!servicio) throw AppError.notFound("Servicio no encontrado");

    return servicio;
};

export const crear = (datos: DatosServicio) => Servicio.create(vacioANulo(datos));

export const actualizar = async (id: number, datos: Partial<DatosServicio>) => {
    const servicio = await obtener(id);

    return servicio.update(vacioANulo(datos));
};

// Si el servicio ya tiene solicitudes, la BD lo impide (409): desactivalo con activo=false.
export const eliminar = async (id: number): Promise<void> => {
    const servicio = await obtener(id);

    await servicio.destroy();
};
