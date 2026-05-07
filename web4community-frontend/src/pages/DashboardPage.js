import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import productoService from '../services/productoService';

const DashboardPage = () => {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    stock: 0,
    avgPrice: 0,
    lowStock: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await productoService.obtenerProductos();
      setProductos(data);
      const total = data.length;
      const stock = data.reduce((s, p) => s + (p.stock || 0), 0);
      const avg = total ? data.reduce((s, p) => s + (p.precio || 0), 0) / total : 0;
      const low = data.filter(p => (p.stock || 0) < 5 && (p.stock || 0) > 0).length;
      setStats({ total, stock, avgPrice: avg.toFixed(2), lowStock: low });
    };
    cargarDatos();
  }, []);

  const recent = [...productos].reverse().slice(0, 5);

  return (
    <>
      <div className="dashboard-header">
        <h1><i className="fas fa-chart-line"></i> Dashboard</h1>
        <p><i className="fas fa-user"></i> Bienvenido, {usuario?.nombre}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-box"></i></div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total productos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-cubes"></i></div>
          <div className="stat-value">{stats.stock}</div>
          <div className="stat-label">Unidades en stock</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
          <div className="stat-value">${stats.avgPrice}</div>
          <div className="stat-label">Precio promedio</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <div className="stat-value">{stats.lowStock}</div>
          <div className="stat-label">Stock bajo</div>
        </div>
      </div>

      <div className="section-title">
        <i className="fas fa-clock"></i> Últimos productos agregados
      </div>
      
      <div className="product-table">
        <div className="product-table-card">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.stock || 0}</td>
                  <td>
                    <span className={`status-badge ${(producto.stock || 0) > 0 ? 'in-stock' : 'out-stock'}`}>
                      <i className={`fas ${(producto.stock || 0) > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      {(producto.stock || 0) > 0 ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    <i className="fas fa-box-open"></i> No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/productos" className="btn-outline">
          <i className="fas fa-list"></i> Ver todos los productos
        </Link>
        <Link to="/productos" className="btn-outline">
          <i className="fas fa-plus"></i> Crear nuevo producto
        </Link>
      </div>
    </>
  );
};

export default DashboardPage;