import path from "path";
import { Transaction } from "sequelize";
import sequelize from "../config/basedatos";
import AppError from "../helpers/AppError";
import { borrarArchivo, rutaRelativa, urlPublica } from "../helpers/archivos";
import { queryBooleano, queryTexto, vacioANulo } from "../helpers/validar";
import { Accesorio, Planta, Producto } from "../models";
import { TipoProducto } from "../models/producto";

export interface DatosProducto {
    tipo: TipoProducto;
    nombre: string;
    descripcion?: string | null;
    precio: number;
    activo?: boolean;
    planta?: Record<string, string | null>;
    accesorio?: Record<string, string | null>;
}

const incluirSubtipos = [
    { model: Planta, as: "planta" },
    { model: Accesorio, as: "accesorio" }
];

// Ruta relativa real de la imagen. Los registros antiguos guardan solo el nombre del
// archivo ("palma-1792526922.jpg"); se resuelven en uploads/productos/<id>/.
const rutaImagen = (producto: Producto): string | null => {
    if (!producto.imagen) return null;

    return producto.imagen.includes("/")
        ? producto.imagen
        : rutaRelativa("productos", producto.id_producto, producto.imagen);
};

// Agrega "imagen_url" a la respuesta JSON del producto.
export const serializar = (producto: Producto) => ({
    ...producto.toJSON(),
    imagen_url: urlPublica(rutaImagen(producto))
});

export const listar = async (query: Record<string, unknown> = {}) => {
    const where: Record<string, unknown> = {};
    const tipo = queryTexto(query.tipo);
    const activo = queryBooleano(query.activo);

    if (tipo) where.tipo = tipo;
    if (activo !== undefined) where.activo = activo;

    const productos = await Producto.findAll({
        where,
        include: incluirSubtipos,
        order: [["id_producto", "ASC"]]
    });

    return productos.map(serializar);
};

const buscar = async (id: number) => {
    const producto = await Producto.findByPk(id, { include: incluirSubtipos });

    if (!producto) throw AppError.notFound("Producto no encontrado");

    return producto;
};

export const obtener = async (id: number) => serializar(await buscar(id));

export const crear = async (datos: DatosProducto) => {
    const { planta, accesorio, ...base } = vacioANulo(datos);

    if (base.tipo === "planta" && accesorio) {
        throw AppError.badRequest("Un producto de tipo planta no admite datos de accesorio");
    }

    if (base.tipo === "accesorio" && planta) {
        throw AppError.badRequest("Un producto de tipo accesorio no admite datos de planta");
    }

    const id = await sequelize.transaction(async (t: Transaction) => {
        const producto = await Producto.create({ ...base, imagen: null }, { transaction: t });

        // Se crea siempre la fila del subtipo (aunque vacia), como en los datos originales.
        if (base.tipo === "planta") {
            await Planta.create(
                { id_producto: producto.id_producto, ...vacioANulo(planta ?? {}) } as never,
                { transaction: t }
            );
        } else {
            await Accesorio.create(
                { id_producto: producto.id_producto, ...vacioANulo(accesorio ?? {}) } as never,
                { transaction: t }
            );
        }

        return producto.id_producto;
    });

    return obtener(id);
};

export const actualizar = async (id: number, datos: Partial<DatosProducto>) => {
    const { planta, accesorio, ...base } = vacioANulo(datos);
    const producto = await buscar(id);

    if (planta && producto.tipo !== "planta") {
        throw AppError.badRequest("Este producto no es una planta");
    }

    if (accesorio && producto.tipo !== "accesorio") {
        throw AppError.badRequest("Este producto no es un accesorio");
    }

    await sequelize.transaction(async (t: Transaction) => {
        await producto.update(base, { transaction: t });

        if (planta) {
            const subtipo = producto.planta ?? (await Planta.create({ id_producto: id } as never, { transaction: t }));
            await subtipo.update(vacioANulo(planta), { transaction: t });
        }

        if (accesorio) {
            const subtipo = producto.accesorio ?? (await Accesorio.create({ id_producto: id } as never, { transaction: t }));
            await subtipo.update(vacioANulo(accesorio), { transaction: t });
        }
    });

    return obtener(id);
};

// Si el producto ya esta en alguna compra, la BD lo impide (409): desactivalo con activo=false.
export const eliminar = async (id: number): Promise<void> => {
    const producto = await buscar(id);
    const imagen = rutaImagen(producto);

    await producto.destroy();

    // Borrar la imagen (y su carpeta si queda vacia) solo despues de eliminar el registro.
    await borrarArchivo(imagen);
};

// ---------------------------------------------------------------------------
// Imagen del producto (archivo ya guardado por el middleware upload en
// public/uploads/productos/<id>/<archivo>)
// ---------------------------------------------------------------------------

export const guardarImagen = async (id: number, archivo: Express.Multer.File | undefined) => {
    if (!archivo) throw AppError.badRequest("Debes enviar una imagen en el campo 'imagen'");

    const nueva = rutaRelativa("productos", id, path.basename(archivo.filename));

    let producto: Producto;

    try {
        producto = await buscar(id);
    } catch (error) {
        await borrarArchivo(nueva);
        throw error;
    }

    const anterior = rutaImagen(producto);

    await producto.update({ imagen: nueva });

    // El archivo anterior se borra solo cuando la BD ya apunta al nuevo.
    if (anterior && anterior !== nueva) await borrarArchivo(anterior);

    return serializar(producto);
};

export const quitarImagen = async (id: number) => {
    const producto = await buscar(id);
    const anterior = rutaImagen(producto);

    await producto.update({ imagen: null });
    await borrarArchivo(anterior);

    return serializar(producto);
};
