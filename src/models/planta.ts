import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";

// La columna "tipo" de la tabla (fija en 'planta') la rellena la BD por DEFAULT.
class Planta extends Model<
    InferAttributes<Planta>,
    InferCreationAttributes<Planta>
> {
    declare id_planta: CreationOptional<number>;
    declare id_producto: number;
    declare ubicacion: string | null;
    declare suelo: string | null;
    declare riego: string | null;
    declare area: string | null;
    declare proposito: string | null;
}

Planta.init(
    {
        id_planta: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_producto: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        ubicacion: { type: DataTypes.STRING(50), allowNull: true },
        suelo: { type: DataTypes.STRING(50), allowNull: true },
        riego: { type: DataTypes.STRING(50), allowNull: true },
        area: { type: DataTypes.STRING(30), allowNull: true },
        proposito: { type: DataTypes.STRING(50), allowNull: true }
    },
    { sequelize, tableName: "planta", timestamps: false }
);

export default Planta;
