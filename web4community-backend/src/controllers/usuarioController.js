// Importamos las dependencias necesarias
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Función para REGISTRAR un nuevo usuario
const registrarUsuario = async (req, res) => {
    try {
        // Obtener datos del cuerpo de la petición (body)
        const { nombre, email, password } = req.body;
        // Validar que todos los campos estén presentes
        if (!nombre || !email || !password) {
            return res.status(400).json({ 
                mensaje: 'Todos los campos son obligatorios' 
            });
        }
// Verificar si el email ya está registrado
        const [usuariosExistentes] = await db.promise().query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ 
                mensaje: 'El correo electrónico ya está registrado' 
            });
        }

        // Encriptar la contraseña (hash)
        // 10 = número de rondas de encriptación (mayor = más seguro, pero más lento)
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Insertar el nuevo usuario en la base de datos
        const [resultado] = await db.promise().query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordEncriptada]
        );

        // Crear un token JWT para que el usuario quede autenticado automáticamente
        const token = jwt.sign(
            { id: resultado.insertId, email: email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // El token expira en 7 días
        );
// Responder con el token y los datos del usuario (sin la contraseña)
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            token: token,
            usuario: {
                id: resultado.insertId,
                nombre: nombre,
                email: email
            }
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
// Función para INICIAR SESIÓN (LOGIN)
const loginUsuario = async (req, res) => {
    try {
        // Obtener email y password del cuerpo de la petición
        const { email, password } = req.body;

        // Validar que ambos campos estén presentes
        if (!email || !password) {
            return res.status(400).json({ 
                mensaje: 'Email y contraseña son obligatorios' 
            });
        }
        // Buscar el usuario por su email
        const [usuarios] = await db.promise().query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]   );
        // Si no existe el usuario
        if (usuarios.length === 0) {
            return res.status(401).json({ 
                mensaje: 'Credenciales inválidas' 
            });
        }
const usuario = usuarios[0];

        // Verificar que la contraseña sea correcta
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ 
                mensaje: 'Credenciales inválidas' 
            });
        }

        // Crear el token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Responder con el token y los datos del usuario
        res.json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

// Exportamos ambas funciones para usarlas en las rutas
module.exports = {
    registrarUsuario,
    loginUsuario
};
