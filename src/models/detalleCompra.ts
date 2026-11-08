import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";
import { decimal } from "./util";

// Linea de una compra. "total" = cantidad x precio del producto en el momento de la compra.
class DetalleCompra extends Model<
    InferAttributes<DetalleCompra>,
    InferCreationAttributes<DetalleCompra>
> {
    declare id_compra: number;
    declare id_producto: number;
    declare cantidad: number;
    declare total: number;
}

DetalleCompra.init(
    {
        id_compra: { type: DataTypes.INTEGER, primaryKey: true },
        id_producto: { type: DataTypes.INTEGER, primaryKey: true },
        cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            get: decimal("total")
        }
    },
    { sequelize, tableName: "detalle_compra", timestamps: false }
);

export default DetalleCompra;
