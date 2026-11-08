import bcrypt from "bcryptjs";
import env from "../config/env";

// Los hashes generados por PHP usan el prefijo $2y$; es identico a $2b$ y
// se normaliza para garantizar compatibilidad con cualquier version de bcryptjs.
const normalizar = (hash: string): string =>
    hash.startsWith("$2y$") ? `$2b$${hash.slice(4)}` : hash;

export const hashPassword = (contrasena: string): Promise<string> =>
    bcrypt.hash(contrasena, env.BCRYPT_ROUNDS);

export const comparePassword = async (
    contrasena: string,
    hash: string
): Promise<boolean> => {
    try {
        return await bcrypt.compare(contrasena, normalizar(hash));
    } catch {
        return false;
    }
};
