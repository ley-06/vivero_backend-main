import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";

// La columna "tipo" de la tabla (fija en 'accesorio') la rellena la BD por DEFAULT.
class Accesorio extends Model<
    InferAttributes<Accesorio>,
    InferCreationAttributes<Accesorio>
> {
    declare id_accesorio: CreationOptional<number>;
    declare id_producto: number;
    declare tamano: string | null;
}

Accesorio.init(
    {
        id_accesorio: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_producto: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        tamano: { type: DataTypes.STRING(50), allowNull: true }
    },
    { sequelize, tableName: "accesorio", timestamps: false }
);

export default Accesorio;
