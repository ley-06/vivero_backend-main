import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";
import { decimal } from "./util";

class Trabajador extends Model<
    InferAttributes<Trabajador>,
    InferCreationAttributes<Trabajador>
> {
    declare id_trabajador: CreationOptional<number>;
    declare id_usuario: number;
    declare especialidad: string | null;
    declare salario_final: number | null;
    declare salario_mensual: number | null;
}

Trabajador.init(
    {
        id_trabajador: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        especialidad: { type: DataTypes.STRING(100), allowNull: true },
        salario_final: { type: DataTypes.DECIMAL(10, 2), allowNull: true, get: decimal("salario_final") },
        salario_mensual: { type: DataTypes.DECIMAL(10, 2), allowNull: true, get: decimal("salario_mensual") }
    },
    { sequelize, tableName: "trabajador", timestamps: false }
);

export default Trabajador;
