import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";
import sequelize from "../config/basedatos";
import type Accesorio from "./accesorio";
import type Planta from "./planta";
import { decimal } from "./util";

export const TIPOS_PRODUCTO = ["planta", "accesorio"] as const;
export type TipoProducto = (typeof TIPOS_PRODUCTO)[number];

class Producto extends Model<
    InferAttributes<Producto>,
    InferCreationAttributes<Producto>
> {
    declare id_producto: CreationOptional<number>;
    declare tipo: TipoProducto;
    declare nombre: string;
    declare descripcion: string | null;
    declare precio: CreationOptional<number>;
    declare imagen: string | null;
    declare activo: CreationOptional<boolean>;

    // Asociaciones (se cargan con include)
    declare planta?: NonAttribute<Planta>;
    declare accesorio?: NonAttribute<Accesorio>;
}

Producto.init(
    {
        id_producto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        tipo: { type: DataTypes.STRING(50), allowNull: false },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        descripcion: { type: DataTypes.TEXT, allowNull: true },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            get: decimal("precio")
        },
        imagen: { type: DataTypes.STRING(255), allowNull: true },
        activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    { sequelize, tableName: "producto", timestamps: false }
);

export default Producto;
