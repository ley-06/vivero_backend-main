// Error controlado: lo lanzan los services y lo traduce el errorHandler a una respuesta HTTP.
export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        Error.captureStackTrace?.(this, this.constructor);
    }

    static badRequest(mensaje: string): AppError { return new AppError(mensaje, 400); }
    static unauthorized(mensaje = "No autenticado"): AppError { return new AppError(mensaje, 401); }
    static forbidden(mensaje = "No tienes permisos para esta accion"): AppError { return new AppError(mensaje, 403); }
    static notFound(mensaje = "Recurso no encontrado"): AppError { return new AppError(mensaje, 404); }
    static conflict(mensaje: string): AppError { return new AppError(mensaje, 409); }
}

export default AppError;
