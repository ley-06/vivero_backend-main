import { Router } from "express";
import { login, me, register } from "../controllers/authController";
import { verificarToken } from "../middlewares/auth";
import { loginSchema, registroSchema } from "../validators/auth";
import { validarBody } from "../validators/joi";

const router = Router();

router.post("/register", validarBody(registroSchema), register);
router.post("/login", validarBody(loginSchema), login);

// /me necesita saber quien eres, por eso es la unica ruta que ya usa verificarToken.
router.get("/me", verificarToken, me);

export default router;
