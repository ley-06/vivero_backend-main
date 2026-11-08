import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";
import { decimal } from "./util";

export const ESTADOS_COMPRA = ["pendiente", "confirmada", "pagada", "cancelada"] as const;
export type EstadoCompra = (typeof ESTADOS_COMPRA)[number];

// Cabecera de la compra. Las lineas estan en DetalleCompra.
class Compra extends Model<
    InferAttributes<Compra>,
    InferCreationAttributes<Compra>
> {
    declare id_compra: CreationOptional<number>;
    declare id_usuario: number;
    declare id_trabajador: number | null;
    declare fecha_gestion: CreationOptional<Date>;
    declare total: CreationOptional<number>;
    declare estado: CreationOptional<EstadoCompra>;
}

Compra.init(
    {
        id_compra: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false },
        id_trabajador: { type: DataTypes.INTEGER, allowNull: true },
        fecha_gestion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            get: decimal("total")
        },
        estado: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "pendiente" }
    },
    { sequelize, tableName: "compra", timestamps: false }
);

export default Compra;
