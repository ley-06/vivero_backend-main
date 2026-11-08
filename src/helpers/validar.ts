import { Request } from "express";
import AppError from "./AppError";

// Convierte req.params.<nombre> en un entero positivo o lanza 400.
export const idParam = (req: Request, nombre = "id"): number => {
    const id = Number(req.params[nombre]);

    if (!Number.isInteger(id) || id <= 0) {
        throw AppError.badRequest("El ID proporcionado no es valido");
    }

    return id;
};

// Cambia las cadenas vacias por null (la BD guarda NULL, no '').
export const vacioANulo = <T extends object>(obj: T): T => {
    const copia = { ...obj } as Record<string, unknown>;

    for (const clave of Object.keys(copia)) {
        if (copia[clave] === "") copia[clave] = null;
    }

    return copia as T;
};

// Lee un filtro de query string como texto (ignora arrays/objetos).
export const queryTexto = (valor: unknown): string | undefined =>
    typeof valor === "string" && valor.trim() ? valor.trim() : undefined;

export const queryEntero = (valor: unknown): number | undefined => {
    const n = Number(queryTexto(valor));
    return Number.isInteger(n) && n > 0 ? n : undefined;
};

export const queryBooleano = (valor: unknown): boolean | undefined => {
    const t = queryTexto(valor);
    if (t === "true") return true;
    if (t === "false") return false;
    return undefined;
};
