import app, { connectDB } from "./app";
import env from "./config/env";

const iniciarServidor = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${env.PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error);
        process.exit(1);
    }
};

iniciarServidor();
