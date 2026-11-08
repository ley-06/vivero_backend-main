import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";

class Cliente extends Model<
    InferAttributes<Cliente>,
    InferCreationAttributes<Cliente>
> {
    declare id_cliente: CreationOptional<number>;
    declare id_usuario: number;
    declare ci: string | null;
    declare direccion: string | null;
}

Cliente.init(
    {
        id_cliente: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        ci: { type: DataTypes.STRING(11), allowNull: true },
        direccion: { type: DataTypes.STRING(255), allowNull: true }
    },
    { sequelize, tableName: "cliente", timestamps: false }
);

export default Cliente;
