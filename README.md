# Vivero — Backend

API REST del vivero: Node.js + TypeScript + Express 5 + Sequelize + **PostgreSQL**.
Seguridad: JWT (`jsonwebtoken`), hash `bcryptjs`, `helmet`, CORS configurable. Subida de imágenes en local.

## Puesta en marcha

1. **Base de datos (pgAdmin)**: crea una base vacía llamada `vivero` y ejecuta en *Query Tool* el script
   `vivero_postgresql.sql` (está en la carpeta superior del proyecto). Crea tablas, restricciones y datos iniciales.
2. **Variables de entorno**: copia `.env.example` a `.env` y completa `DB_*` y `JWT_SECRET`.
   ```bash
   cp .env.example .env
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # valor para JWT_SECRET
   ```
3. **Dependencias y arranque**
   ```bash
   npm install
   npm run dev          # desarrollo (nodemon + ts-node)
   npm run build && npm start   # producción
   npm run typecheck    # comprobación de tipos
   npm run seed         # datos de prueba (ver docs/MIDDLEWARES.md §6)
   ```

## Arquitectura

```
route  ->  controller  ->  service  ->  model (Sequelize)  ->  PostgreSQL
(Joi)      (HTTP)          (lógica)
```
- `src/routes`: endpoints + validación Joi (`src/validators`).
- `src/controllers`: leen `req`, llaman al service y responden. Sin lógica de negocio.
- `src/services`: **toda la lógica** (reglas, transacciones, consultas). Lanzan `AppError`.
- `src/models`: modelos y asociaciones. `src/helpers`: `hash`, `jwt`, `archivos`, `respuesta`, `AppError`.
- `src/middlewares`: `auth` (JWT), `roles`, `upload` (multer), `errorHandler`.

## Endpoints (prefijo `/api`)

| Módulo | Rutas |
|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` · `GET /auth/me` |
| Usuarios | `GET/POST /usuarios` · `GET/PUT/DELETE /usuarios/:id` |
| Clientes | `GET/POST /clientes` · `GET/PUT/DELETE /clientes/:id` |
| Trabajadores | `GET/POST /trabajadores` · `GET/PUT/DELETE /trabajadores/:id` |
| Productos | `GET/POST /productos` (`?tipo=&activo=`) · `GET/PUT/DELETE /productos/:id` · `POST/DELETE /productos/:id/imagen` |
| Servicios | `GET/POST /servicios` (`?tipo=&activo=`) · `GET/PUT/DELETE /servicios/:id` |
| Compras | `GET/POST /compras` (`?estado=&id_usuario=`) · `GET/PUT/DELETE /compras/:id` |
| Solicitudes | `GET/POST /solicitudes` (`?estado=&id_usuario=`) · `GET/PUT/DELETE /solicitudes/:id` |
| Otros | `GET /health` · `GET /uploads/...` (archivos subidos) |

Respuestas: `{ "status": "success", ... }` o `{ "status": "error", "message": "..." }`.

Notas de negocio:
- `compra` es la cabecera y `detalle_compra` sus líneas. `POST /compras` recibe `{ id_usuario, items: [{ id_producto, cantidad }] }`
  y el servidor calcula los totales con el precio actual.
- `POST /productos` recibe `tipo` (`planta`/`accesorio`) y el bloque `planta` o `accesorio` con sus datos.
- `POST /auth/register` siempre crea un usuario con rol `cliente`.

## Subida de archivos

`POST /api/productos/:id/imagen` (`multipart/form-data`, campo `imagen`, JPG/PNG/WEBP, máx. `MAX_FILE_SIZE_MB`).
Se guarda en `public/uploads/productos/<id>/img-<timestamp>-<aleatorio>.<ext>`; `producto.imagen` guarda la ruta
relativa (`productos/<id>/…`) y la respuesta incluye `imagen_url` (`/uploads/productos/<id>/…`).
Las imágenes del dump original (solo nombre de archivo) se resuelven en `uploads/productos/<id>/<nombre>`.

## Seguridad y middlewares

`verificarToken` y `permitirRoles` están creados pero **todavía no aplicados** a las rutas.
Guía de activación, tabla de rutas propuesta y documentación del seeder: [docs/MIDDLEWARES.md](docs/MIDDLEWARES.md).
