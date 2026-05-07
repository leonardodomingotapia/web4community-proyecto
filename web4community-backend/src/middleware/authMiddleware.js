// Importamos jsonwebtoken para verificar los tokens
const jwt = require('jsonwebtoken');

// Cargamos variables de entorno
require('dotenv').config();
// Middleware: función que se ejecuta ANTES de llegar a la ruta
const verificarToken = (req, res, next) => {
    // Obtener el token del header Authorization
    // El header viene así: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Separamos "Bearer" del token
    // Si no hay token, el usuario no está autenticado
    if (!token) {
        return res.status(401).json({ 
            mensaje: 'Acceso denegado. No se proporcionó token' 
        });
    }

// Verificar que el token sea válido
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id; // Guardamos el ID del usuario en la solicitud
        next(); // Continuamos con la siguiente función (el controlador)
    } catch (error) {
        return res.status(403).json({ 
            mensaje: 'Token inválido o expirado' 
        });
    }
};
// Exportamos la función para usarla en las rutas protegidas
module.exports = verificarToken;

