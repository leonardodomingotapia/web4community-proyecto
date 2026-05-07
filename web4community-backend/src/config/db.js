// Importamos mysql2 para conectar con la base de datos
const mysql = require('mysql2');

// Importamos dotenv para leer las variables de entorno
require('dotenv').config();

// Creamos la conexión a MySQL usando las variables del archivo .env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,        // localhost
    user: process.env.DB_USER,        // root
    password: process.env.DB_PASSWORD, // tu contraseña
    database: process.env.DB_NAME      // web4community_db
});

// Conectamos a la base de datos
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a MySQL:', error);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Exportamos la conexión para usarla en otros archivos
module.exports = connection;