import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import sequelize from "../config/basedatos";

export const ESTADOS_SOLICITUD = ["pendiente", "en_proceso", "completado", "cancelado"] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

class Solicitud extends Model<
    InferAttributes<Solicitud>,
    InferCreationAttributes<Solicitud>
> {
    declare id_solicitud: CreationOptional<number>;
    declare id_usuario: number | null;
    declare id_compra: number | null;
    declare id_servicio: number;
    declare id_trabajador: number | null;
    declare fecha_gestion: CreationOptional<Date>;
    declare estado: EstadoSolicitud;
    declare municipio: string | null;
    declare nombre_destinatario: string | null;
    declare ci_destinatario: string | null;
    declare telefono_destinatario: string | null;
    declare direccion_servicio: string | null;
    declare nombre_cliente: string | null;
    declare apellidos_cliente: string | null;
    declare ci_cliente: string | null;
    declare telefono_cliente: string | null;
    declare direccion_cliente: string | null;
    declare fecha_programada: string | null;
}

Solicitud.init(
    {
        id_solicitud: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: true },
        id_compra: { type: DataTypes.INTEGER, allowNull: true },
        id_servicio: { type: DataTypes.INTEGER, allowNull: false },
        id_trabajador: { type: DataTypes.INTEGER, allowNull: true },
        fecha_gestion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        estado: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "pendiente" },
        municipio: { type: DataTypes.STRING(50), allowNull: true },
        nombre_destinatario: { type: DataTypes.STRING(150), allowNull: true },
        ci_destinatario: { type: DataTypes.STRING(11), allowNull: true },
        telefono_destinatario: { type: DataTypes.STRING(20), allowNull: true },
        direccion_servicio: { type: DataTypes.STRING(255), allowNull: true },
        nombre_cliente: { type: DataTypes.STRING(60), allowNull: true },
        apellidos_cliente: { type: DataTypes.STRING(100), allowNull: true },
        ci_cliente: { type: DataTypes.STRING(11), allowNull: true },
        telefono_cliente: { type: DataTypes.STRING(20), allowNull: true },
        direccion_cliente: { type: DataTypes.STRING(255), allowNull: true },
        fecha_programada: { type: DataTypes.DATEONLY, allowNull: true }
    },
    { sequelize, tableName: "solicitud", timestamps: false }
);

export default Solicitud;
