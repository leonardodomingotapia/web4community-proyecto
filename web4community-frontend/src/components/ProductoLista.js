import React, { useState, useEffect } from 'react';
import productoService from '../services/productoService';
import ProductoCard from './ProductoCard';
import ProductoForm from './ProductoForm';

const ProductoLista = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const data = await productoService.obtenerProductos();
      setProductos(data);
      setError('');
    } catch (err) {
      setError(err.mensaje || 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = async (productoData) => {
    try {
      const nuevoProducto = await productoService.crearProducto(productoData);
      setProductos([nuevoProducto, ...productos]);
      setMostrarFormulario(false);
    } catch (err) {
      setError(err.mensaje || 'Error al crear producto');
    }
  };

  const handleActualizar = async (productoData) => {
    try {
      const productoActualizado = await productoService.actualizarProducto(
        productoEditando.id,
        productoData
      );
      setProductos(
        productos.map((p) =>
          p.id === productoActualizado.id ? productoActualizado : p
        )
      );
      setProductoEditando(null);
      setMostrarFormulario(false);
    } catch (err) {
      setError(err.mensaje || 'Error al actualizar producto');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productoService.eliminarProducto(id);
        setProductos(productos.filter((p) => p.id !== id));
      } catch (err) {
        setError(err.mensaje || 'Error al eliminar producto');
      }
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  if (cargando) {
    return <div className="cargando-futurista">Cargando productos...</div>;
  }

  return (
    <div className="productos-container-futurista">
      <div className="productos-header-futurista">
        <h2><i className="fas fa-cube"></i> Mis Productos</h2>
        <button
          className="btn-create-futurista"
          onClick={() => {
            setProductoEditando(null);
            setMostrarFormulario(true);
          }}
        >
          <i className="fas fa-plus"></i> Nuevo Producto
        </button>
      </div>

      {error && <div className="error-alert-futurista">{error}</div>}

      {mostrarFormulario && (
        <ProductoForm
          productoInicial={productoEditando}
          onGuardar={productoEditando ? handleActualizar : handleCrear}
          onCancelar={() => {
            setMostrarFormulario(false);
            setProductoEditando(null);
          }}
        />
      )}

      {productos.length === 0 ? (
        <div className="empty-state-futurista">
          <i className="fas fa-box-open"></i>
          <p>No tienes productos aún</p>
          <p className="empty-sub">Haz clic en "Nuevo Producto" para comenzar</p>
        </div>
      ) : (
        <div className="productos-grid-futurista">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductoLista;