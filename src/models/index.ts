import sequelize from "../config/basedatos";

import Usuario from "./usuario";
import Cliente from "./cliente";
import Trabajador from "./trabajador";
import Producto from "./producto";
import Planta from "./planta";
import Accesorio from "./accesorio";
import Servicio from "./servicio";
import Compra from "./compra";
import DetalleCompra from "./detalleCompra";
import Solicitud from "./solicitud";

// =====================================================
// ASOCIACIONES (reflejan las FOREIGN KEY de vivero_postgresql.sql)
// =====================================================

// usuario 1-1 cliente / trabajador
Usuario.hasOne(Cliente, { foreignKey: "id_usuario", as: "cliente", onDelete: "CASCADE" });
Cliente.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Usuario.hasOne(Trabajador, { foreignKey: "id_usuario", as: "trabajador", onDelete: "CASCADE" });
Trabajador.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// producto 1-1 planta / accesorio
Producto.hasOne(Planta, { foreignKey: "id_producto", as: "planta", onDelete: "CASCADE" });
Planta.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });

Producto.hasOne(Accesorio, { foreignKey: "id_producto", as: "accesorio", onDelete: "CASCADE" });
Accesorio.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });

// compra (cabecera) 1-N detalle_compra
Compra.hasMany(DetalleCompra, { foreignKey: "id_compra", as: "detalles", onDelete: "CASCADE" });
DetalleCompra.belongsTo(Compra, { foreignKey: "id_compra", as: "compra" });

Producto.hasMany(DetalleCompra, { foreignKey: "id_producto", as: "detalles" });
DetalleCompra.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });

// compra -> usuario / trabajador
Usuario.hasMany(Compra, { foreignKey: "id_usuario", as: "compras" });
Compra.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Trabajador.hasMany(Compra, { foreignKey: "id_trabajador", as: "compras" });
Compra.belongsTo(Trabajador, { foreignKey: "id_trabajador", as: "trabajador" });

// solicitud -> usuario / compra / servicio / trabajador
Usuario.hasMany(Solicitud, { foreignKey: "id_usuario", as: "solicitudes" });
Solicitud.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Compra.hasMany(Solicitud, { foreignKey: "id_compra", as: "solicitudes" });
Solicitud.belongsTo(Compra, { foreignKey: "id_compra", as: "compra" });

Servicio.hasMany(Solicitud, { foreignKey: "id_servicio", as: "solicitudes" });
Solicitud.belongsTo(Servicio, { foreignKey: "id_servicio", as: "servicio" });

Trabajador.hasMany(Solicitud, { foreignKey: "id_trabajador", as: "solicitudes" });
Solicitud.belongsTo(Trabajador, { foreignKey: "id_trabajador", as: "trabajador" });

const modelos = {
    Usuario,
    Cliente,
    Trabajador,
    Producto,
    Planta,
    Accesorio,
    Servicio,
    Compra,
    DetalleCompra,
    Solicitud,
    sequelize
};

export {
    Usuario,
    Cliente,
    Trabajador,
    Producto,
    Planta,
    Accesorio,
    Servicio,
    Compra,
    DetalleCompra,
    Solicitud,
    sequelize
};

export default modelos;
