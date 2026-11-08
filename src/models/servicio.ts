import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";
import { decimal } from "./util";

class Servicio extends Model<
    InferAttributes<Servicio>,
    InferCreationAttributes<Servicio>
> {
    declare id_servicio: CreationOptional<number>;
    declare nombre: string;
    declare descripcion: string | null;
    declare costo: CreationOptional<number>;
    declare tipo: string | null;
    declare activo: CreationOptional<boolean>;
}

Servicio.init(
    {
        id_servicio: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        descripcion: { type: DataTypes.TEXT, allowNull: true },
        costo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            get: decimal("costo")
        },
        tipo: { type: DataTypes.STRING(50), allowNull: true },
        activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    { sequelize, tableName: "servicio", timestamps: false }
);

export default Servicio;
