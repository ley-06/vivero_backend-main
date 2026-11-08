import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import { NextFunction, Request, Response } from "express";
import env from "../config/env";
import AppError from "../helpers/AppError";
import { borrarArchivo, carpetaEntidad, EntidadArchivo, rutaRelativa } from "../helpers/archivos";

const EXTENSIONES: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

// Firmas (magic bytes) para no fiarse solo del mimetype que declara el cliente.
const firmaValida = (cabecera: Buffer, mimetype: string): boolean => {
    if (mimetype === "image/jpeg") return cabecera.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
    if (mimetype === "image/png") return cabecera.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (mimetype === "image/webp") return cabecera.subarray(0, 4).toString() === "RIFF" && cabecera.subarray(8, 12).toString() === "WEBP";
    return false;
};

// Crea el middleware de subida de UNA imagen para una entidad.
// Guarda en: <UPLOAD_DIR>/<entidad>/<req.params.id>/img-<aleatorio>.<ext>
export const subirImagen = (entidad: EntidadArchivo, campo = "imagen") => {
    const almacenamiento = multer.diskStorage({
        destination: (req, _file, cb) => {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                cb(AppError.badRequest("El ID proporcionado no es valido"), "");
                return;
            }

            const carpeta = carpetaEntidad(entidad, id);

            fs.mkdir(carpeta, { recursive: true }, (error) => cb(error, carpeta));
        },
        filename: (_req, file, cb) => {
            cb(null, `img-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${EXTENSIONES[file.mimetype]}`);
        }
    });

    const multerUpload = multer({
        storage: almacenamiento,
        limits: { fileSize: env.MAX_FILE_SIZE_BYTES, files: 1 },
        fileFilter: (_req, file, cb) => {
            if (!EXTENSIONES[file.mimetype]) {
                cb(AppError.badRequest("Formato no permitido: usa JPG, PNG o WEBP"));
                return;
            }
            cb(null, true);
        }
    }).single(campo);

    // Subida + comprobacion de la firma real del archivo.
    return (req: Request, res: Response, next: NextFunction): void => {
        multerUpload(req, res, async (error?: unknown) => {
            if (error) {
                next(error);
                return;
            }

            if (!req.file) {
                next();
                return;
            }

            try {
                const handle = await fs.promises.open(req.file.path, "r");
                const cabecera = Buffer.alloc(12);
                await handle.read(cabecera, 0, 12, 0);
                await handle.close();

                if (!firmaValida(cabecera, req.file.mimetype)) {
                    await borrarArchivo(rutaRelativa(entidad, Number(req.params.id), req.file.filename));
                    next(AppError.badRequest("El archivo no es una imagen valida"));
                    return;
                }

                next();
            } catch (e) {
                next(e);
            }
        });
    };
};

export const subirImagenProducto = subirImagen("productos");
