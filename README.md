# dokploy-practica

Aplicación Express.js para la práctica **Administración de Contenedores con Dokploy**
(Administración de Infraestructura de TI — Universidad del Quindío, 2026-1).

## Rutas

| Ruta | Qué devuelve |
|---|---|
| `/` | Mensaje de bienvenida con datos del curso y la versión |
| `/health` | Estado de salud, uptime y versión de Node |
| `/info` | Plataforma, arquitectura, hostname del contenedor y memoria |
| `/db` | Prueba de conexión a la base de datos MySQL creada en Dokploy |

## Variables de entorno

Se configuran en Dokploy (pestaña **Environment**). Ver `.env.example`.

- `NODE_ENV`, `PORT`, `APP_NAME`, `APP_VERSION`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (Fase 4)

## Despliegue

Dokploy construye la imagen con **Nixpacks** (detecta Node.js automáticamente) y
ejecuta `npm start`.

## Docker Compose (Fase 5)

`docker-compose.yml` levanta cuatro servicios: `app` (Node 20), `mongodb`,
`phpmyadmin` y `db-service` (MySQL 8.0).

Corrección respecto a la guía: el servicio `app` usaba `node:20-alpine` sin comando,
por lo que el contenedor se detenía al iniciar. Ahora ejecuta un servidor HTTP mínimo
en el puerto 3000 (publicado en el 3001 del host).
