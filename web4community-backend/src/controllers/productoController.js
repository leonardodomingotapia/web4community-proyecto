const db = require('../config/db');

// Obtener todos los productos del usuario
const obtenerProductos = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const [productos] = await db.promise().query(
      'SELECT * FROM productos WHERE usuario_id = ? ORDER BY created_at DESC',
      [usuarioId]
    );
    res.json({ productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId;
    const [productos] = await db.promise().query(
      'SELECT * FROM productos WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ producto: productos[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    const usuarioId = req.usuarioId;
    
    if (!nombre || !precio) {
      return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
    }
    
    const [resultado] = await db.promise().query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, usuario_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion || '', precio, stock || 0, usuarioId]
    );
    
    res.status(201).json({ 
      mensaje: 'Producto creado', 
      id: resultado.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    const usuarioId = req.usuarioId;
    
    const [productos] = await db.promise().query(
      'SELECT * FROM productos WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
    
    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    await db.promise().query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
      [nombre, descripcion, precio, stock, id]
    );
    
    res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId;
    
    const [productos] = await db.promise().query(
      'SELECT * FROM productos WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
    
    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    await db.promise().query('DELETE FROM productos WHERE id = ?', [id]);
    
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};