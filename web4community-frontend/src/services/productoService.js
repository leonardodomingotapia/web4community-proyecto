import api from './api';

const productoService = {
  obtenerProductos: async () => {
    try {
      const response = await api.get('/productos');
      return response.data.productos || [];
    } catch (error) {
      throw error.response?.data || { mensaje: 'Error al cargar productos' };
    }
  },

  crearProducto: async (producto) => {
    try {
      const response = await api.post('/productos', producto);
      // El backend devuelve: { mensaje: 'Producto creado', id: X }
      // Construimos el producto completo para el frontend
      return {
        id: response.data.id,
        ...producto
      };
    } catch (error) {
      throw error.response?.data || { mensaje: 'Error al crear producto' };
    }
  },

  actualizarProducto: async (id, producto) => {
    try {
      await api.put(`/productos/${id}`, producto);
      // Devolvemos el producto actualizado con el id
      return { id, ...producto };
    } catch (error) {
      throw error.response?.data || { mensaje: 'Error al actualizar producto' };
    }
  },

  eliminarProducto: async (id) => {
    try {
      await api.delete(`/productos/${id}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { mensaje: 'Error al eliminar producto' };
    }
  },
};

export default productoService;