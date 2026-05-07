import React from 'react';

const ProductoCard = ({ producto, onEditar, onEliminar }) => {
  const estaDisponible = producto.stock > 0;

  return (
    <div className={`producto-card-futurista ${estaDisponible ? 'disponible' : 'agotado'}`}>
      <div className="card-header-futurista">
        <h3>{producto.nombre}</h3>
        <span className={`stock-badge ${estaDisponible ? 'in-stock' : 'out-stock'}`}>
          <i className={`fas ${estaDisponible ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
          {estaDisponible ? 'Disponible' : 'Agotado'}
        </span>
      </div>
      
      <p className="card-desc-futurista">{producto.descripcion || 'Sin descripción'}</p>
      
      <div className="card-price-futurista">
        <span className="price-label">Precio</span>
        <span className="price-value">${producto.precio}</span>
      </div>
      
      <div className="card-stock-futurista">
        <span className="stock-label">Stock</span>
        <span className="stock-value">{producto.stock} unidades</span>
      </div>
      
      <div className="card-actions-futurista">
        <button onClick={() => onEditar(producto)} className="btn-edit-futurista">
          <i className="fas fa-edit"></i> Editar
        </button>
        <button onClick={() => onEliminar(producto.id)} className="btn-delete-futurista">
          <i className="fas fa-trash-alt"></i> Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;