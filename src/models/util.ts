import { Model } from "sequelize";

// PostgreSQL devuelve NUMERIC como string; este getter lo expone como number (o null).
export const decimal = (campo: string) =>
    function (this: Model): number | null {
        const valor = this.getDataValue(campo);
        return valor === null || valor === undefined ? null : Number(valor);
    };
