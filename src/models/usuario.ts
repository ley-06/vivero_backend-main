import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";
import sequelize from "../config/basedatos";
import type Cliente from "./cliente";
import type Trabajador from "./trabajador";

export const ROLES = ["administrador", "trabajador", "cliente"] as const;
export type RolUsuario = (typeof ROLES)[number];

class Usuario extends Model<
    InferAttributes<Usuario>,
    InferCreationAttributes<Usuario>
> {
    declare id_usuario: CreationOptional<number>;
    declare nombre: string;
    declare apellidos: string;
    declare usuario: string;
    declare contrasena: string;
    declare rol: RolUsuario;
    declare telefono: string | null;

    // Asociaciones (se cargan con include)
    declare cliente?: NonAttribute<Cliente>;
    declare trabajador?: NonAttribute<Trabajador>;
}

Usuario.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: { type: DataTypes.STRING(60), allowNull: false },
        apellidos: { type: DataTypes.STRING(100), allowNull: false },
        usuario: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        contrasena: { type: DataTypes.STRING(255), allowNull: false },
        rol: { type: DataTypes.STRING(60), allowNull: false },
        telefono: { type: DataTypes.STRING(20), allowNull: true }
    },
    {
        sequelize,
        tableName: "usuario",
        timestamps: false,
        // La contrasena nunca se devuelve salvo que se pida con scope "conContrasena".
        defaultScope: { attributes: { exclude: ["contrasena"] } },
        scopes: { conContrasena: { attributes: { include: ["contrasena"] } } }
    }
);

export default Usuario;
