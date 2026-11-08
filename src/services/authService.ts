import AppError from "../helpers/AppError";
import { comparePassword, hashPassword } from "../helpers/hash";
import { firmarToken } from "../helpers/jwt";
import { Usuario } from "../models";
import * as usuarioService from "./usuarioService";

// Hash de relleno: se compara igualmente cuando el usuario no existe para que el
// tiempo de respuesta no revele si el nombre de usuario es valido.
const hashRelleno = hashPassword("relleno-para-igualar-tiempos");

const respuestaAuth = (usuario: Usuario) => ({
    token: firmarToken({ id_usuario: usuario.id_usuario, rol: usuario.rol }),
    usuario
});

export const login = async (nombreUsuario: string, contrasena: string) => {
    const usuario = await Usuario.scope("conContrasena").findOne({
        where: { usuario: nombreUsuario }
    });

    const valida = await comparePassword(contrasena, usuario?.contrasena ?? (await hashRelleno));

    if (!usuario || !valida) {
        throw AppError.unauthorized("Usuario o contrasena incorrectos");
    }

    // Se devuelve el usuario sin contrasena.
    return respuestaAuth(await usuarioService.obtener(usuario.id_usuario));
};

// El registro publico siempre crea un cliente.
export const registrar = async (
    datos: Omit<usuarioService.DatosCrearUsuario, "rol">
) => {
    const usuario = await usuarioService.crear({ ...datos, rol: "cliente" });

    return respuestaAuth(usuario);
};

export const perfil = (idUsuario: number) => usuarioService.obtener(idUsuario);
