import fs from "fs";
import path from "path";
import env from "../config/env";

// Estructura: <UPLOAD_DIR>/<entidad>/<id>/<archivo>
// Ejemplo:    public/uploads/productos/8/pino-1792358424.jpg
// En la BD se guarda la ruta relativa a UPLOAD_DIR: "productos/8/pino-1792358424.jpg"
export type EntidadArchivo = "productos";

export const carpetaEntidad = (entidad: EntidadArchivo, id: number): string =>
    path.join(env.UPLOAD_DIR, entidad, String(id));

export const rutaRelativa = (entidad: EntidadArchivo, id: number, archivo: string): string =>
    `${entidad}/${id}/${archivo}`;

// URL publica (servida por express.static en /uploads)
export const urlPublica = (rutaRel: string | null | undefined): string | null =>
    rutaRel ? `/uploads/${rutaRel}` : null;

// Elimina un archivo guardado a partir de su ruta relativa. Ignora si no existe
// y evita salirse de UPLOAD_DIR (path traversal).
export const borrarArchivo = async (rutaRel: string | null | undefined): Promise<void> => {
    if (!rutaRel) return;

    const base = path.resolve(env.UPLOAD_DIR);
    const absoluta = path.resolve(base, rutaRel);

    if (!absoluta.startsWith(base + path.sep)) return;

    await fs.promises.unlink(absoluta).catch((e: NodeJS.ErrnoException) => {
        if (e.code !== "ENOENT") throw e;
    });

    // Si la carpeta <entidad>/<id> quedo vacia, se elimina (si no esta vacia, falla y se ignora).
    await fs.promises.rmdir(path.dirname(absoluta)).catch(() => undefined);
};
