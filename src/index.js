const express = require('express');
const os = require('os');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        mensaje: '¡Actualización automática con Dokploy!',
        institucion: 'Universidad del Quindío',
        programa: 'Ingeniería de Sistemas y Computación',
        curso: 'Administración de Infraestructura de TI',
        plataforma: 'Dokploy PaaS',
        app: process.env.APP_NAME || 'webapp-uni-quindio',
        version: '2.0.0', deploy: 'Git Push to Deploy',
        fecha: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        estado: 'saludable',
        uptime: process.uptime(),
        version: process.version,
        plataforma: 'Dokploy'
    });
});

app.get('/info', (req, res) => {
    res.json({
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        hostname: os.hostname(),
        memory: {
            total: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
            free: Math.round(os.freemem() / 1024 / 1024) + ' MB'
        }
    });
});

// Prueba de conexión a la base de datos MySQL creada en Dokploy (Fase 4).
// Usa las variables DB_HOST, DB_PORT, DB_NAME, DB_USER y DB_PASSWORD.
app.get('/db', async (req, res) => {
    if (!process.env.DB_HOST) {
        return res.status(500).json({
            conexion: 'sin configurar',
            detalle: 'Faltan las variables DB_* en la pestaña Environment'
        });
    }
    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectTimeout: 5000
        });
        const [rows] = await conn.query('SELECT VERSION() AS version, DATABASE() AS base_de_datos, NOW() AS hora');
        res.json({
            conexion: 'exitosa',
            host: process.env.DB_HOST,
            mysql_version: rows[0].version,
            base_de_datos: rows[0].base_de_datos,
            hora_servidor_bd: rows[0].hora
        });
    } catch (err) {
        res.status(500).json({ conexion: 'fallida', error: err.message });
    } finally {
        if (conn) await conn.end();
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${port}`);
    console.log('Plataforma: Dokploy PaaS');
});
