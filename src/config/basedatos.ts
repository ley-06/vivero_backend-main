import { Sequelize } from "sequelize";
import env from "./env";

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "postgres",

    logging: env.DB_LOGGING ? console.log : false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // Las tablas ya existen (vivero_postgresql.sql): no hay timestamps ni sync.
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

export default sequelize;
