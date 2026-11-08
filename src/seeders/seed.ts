/**
 * Seeder inicial de DESARROLLO / PRUEBAS.
 *
 *   npm run seed
 *
 * - Es idempotente: se puede ejecutar varias veces sin duplicar datos
 *   (busca cada registro por su clave natural: usuario, nombre del producto/servicio).
 * - Necesita que las tablas ya existan (ejecuta antes vivero_postgresql.sql en pgAdmin).
 * - No toca los datos del dump original: usa usuarios y productos propios con sufijo "_test"
 *   o nombres identificables ("[Seed] ...").
 * - NO se ejecuta en produccion (NODE_ENV=production) salvo que se pase --force.
 * - Contrasena de los usuarios de prueba: SEED_PASSWORD (.env) o "Vivero123*".
 */
import env from "../config/env";
import sequelize from "../config/basedatos";
import { Compra, Producto, Servicio, Solicitud, Usuario } from "../models";
import * as compraService from "../services/compraService";
import * as productoService from "../services/productoService";
import * as usuarioService from "../services/usuarioService";

const PASSWORD = process.env.SEED_PASSWORD || "Vivero123*";

const usuariosPrueba = [
    {
        nombre: "Admin",
        apellidos: "De Prueba",
        usuario: "admin_test",
        telefono: "50000001",
        rol: "administrador" as const
    },
    {
        nombre: "Tomas",
        apellidos: "Trabajador De Prueba",
        usuario: "trabajador_test",
        telefono: "50000002",
        rol: "trabajador" as const,
        especialidad: "Jardineria",
        salario_mensual: 3000,
        salario_final: 3200
    },
    {
        nombre: "Clara",
        apellidos: "Cliente De Prueba",
        usuario: "cliente_test",
        telefono: "50000003",
        rol: "cliente" as const,
        ci: "90010112345",
        direccion: "Calle Falsa 123, Sancti Spiritus"
    }
];

const productosPrueba = [
    {
        tipo: "planta" as const,
        nombre: "[Seed] Helecho",
        descripcion: "Planta de interior de hoja verde",
        precio: 150,
        planta: { ubicacion: "Interior", suelo: "Humedo", riego: "Moderado", area: "0.5m", proposito: "Decoracion" }
    },
    {
        tipo: "planta" as const,
        nombre: "[Seed] Bambu",
        descripcion: "Crece rapido, ideal para cercas vivas",
        precio: 400,
        planta: { ubicacion: "Exterior", suelo: "Suelto", riego: "Abundante", area: "3m", proposito: "Cerca viva" }
    },
    {
        tipo: "accesorio" as const,
        nombre: "[Seed] Maceta de barro",
        descripcion: "Maceta de barro cocido",
        precio: 120,
        accesorio: { tamano: "Mediano" }
    },
    {
        tipo: "accesorio" as const,
        nombre: "[Seed] Regadera",
        descripcion: "Regadera de 5 litros",
        precio: 90,
        accesorio: { tamano: "Pequeno" }
    }
];

const serviciosPrueba = [
    { nombre: "[Seed] Poda", descripcion: "Poda de arboles y arbustos", costo: 120, tipo: "jardineria" },
    { nombre: "[Seed] Siembra", descripcion: "Siembra de las plantas seleccionadas", costo: 350, tipo: "jardineria" },
    { nombre: "[Seed] Entrega - Cabaiguan", descripcion: "Entrega a domicilio", costo: 100, tipo: "entrega" }
];

const sembrar = async (): Promise<void> => {
    if (env.esProduccion && !process.argv.includes("--force")) {
        throw new Error("El seeder esta pensado para desarrollo. En produccion usa --force bajo tu responsabilidad.");
    }

    await sequelize.authenticate();
    console.log(`Sembrando datos de prueba en "${env.DB_NAME}"...`);

    // ---- Usuarios (+ ficha de cliente / trabajador) ----
    for (const datos of usuariosPrueba) {
        const existe = await Usuario.findOne({ where: { usuario: datos.usuario } });

        if (existe) {
            console.log(`  = usuario ${datos.usuario} (ya existia)`);
            continue;
        }

        await usuarioService.crear({ ...datos, contrasena: PASSWORD });
        console.log(`  + usuario ${datos.usuario} (${datos.rol})`);
    }

    // ---- Productos (+ planta / accesorio) ----
    for (const datos of productosPrueba) {
        const existe = await Producto.findOne({ where: { nombre: datos.nombre } });

        if (existe) {
            console.log(`  = producto ${datos.nombre} (ya existia)`);
            continue;
        }

        await productoService.crear(datos);
        console.log(`  + producto ${datos.nombre}`);
    }

    // ---- Servicios ----
    for (const datos of serviciosPrueba) {
        const [, creado] = await Servicio.findOrCreate({ where: { nombre: datos.nombre }, defaults: datos });
        console.log(`  ${creado ? "+" : "="} servicio ${datos.nombre}`);
    }

    // ---- Una compra y una solicitud de ejemplo para el cliente de prueba ----
    const cliente = await Usuario.findOne({ where: { usuario: "cliente_test" } });
    const trabajador = await Usuario.findOne({ where: { usuario: "trabajador_test" }, include: ["trabajador"] });

    if (cliente && trabajador?.trabajador) {
        if ((await Compra.count({ where: { id_usuario: cliente.id_usuario } })) === 0) {
            const helecho = await Producto.findOne({ where: { nombre: "[Seed] Helecho" } });
            const maceta = await Producto.findOne({ where: { nombre: "[Seed] Maceta de barro" } });

            const compra = await compraService.crear({
                id_usuario: cliente.id_usuario,
                id_trabajador: trabajador.trabajador.id_trabajador,
                items: [
                    { id_producto: helecho!.id_producto, cantidad: 2 },
                    { id_producto: maceta!.id_producto, cantidad: 1 }
                ]
            });
            console.log(`  + compra #${compra.id_compra} (total ${compra.total})`);

            const entrega = await Servicio.findOne({ where: { nombre: "[Seed] Entrega - Cabaiguan" } });

            await Solicitud.create({
                id_usuario: cliente.id_usuario,
                id_compra: compra.id_compra,
                id_servicio: entrega!.id_servicio,
                id_trabajador: trabajador.trabajador.id_trabajador,
                estado: "pendiente",
                municipio: "Cabaiguan",
                nombre_destinatario: "Destinatario De Prueba",
                ci_destinatario: "90010112345",
                telefono_destinatario: "50000003",
                direccion_servicio: "Calle Falsa 123",
                nombre_cliente: null,
                apellidos_cliente: null,
                ci_cliente: null,
                telefono_cliente: null,
                direccion_cliente: null,
                fecha_programada: null
            });
            console.log("  + solicitud de entrega vinculada a la compra");
        } else {
            console.log("  = compra/solicitud de ejemplo (ya existian)");
        }
    }

    console.log("\nListo. Usuarios de prueba (contrasena en SEED_PASSWORD o 'Vivero123*'):");
    console.log("  admin_test | trabajador_test | cliente_test");
};

sembrar()
    .then(() => sequelize.close())
    .catch(async (error) => {
        console.error("Error en el seeder:", error instanceof Error ? error.message : error);
        await sequelize.close().catch(() => undefined);
        process.exit(1);
    });
