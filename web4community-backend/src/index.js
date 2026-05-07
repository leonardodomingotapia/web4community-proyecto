// Importamos las dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos las rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');

// Importamos la conexión a la base de datos
const db = require('./config/db');

// Creamos la aplicación Express
const app = express();

// Middlewares globales
app.use(cors());                    // Permite conexiones desde el frontend
app.use(express.json());            // Permite recibir JSON en el body de las peticiones
app.use(express.urlencoded({ extended: true })); // Permite recibir datos de formularios

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        mensaje: 'Servidor Web4Community funcionando correctamente',
        timestamp: new Date()
    });
});
// Rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});
// Puerto del servidor
const PORT = process.env.PORT || 5000;
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
});
