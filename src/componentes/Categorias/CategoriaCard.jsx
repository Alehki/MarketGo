import React from 'react';

export const CategoriaCard = ({ categoria, onSeleccionarCategoria }) => {
  const { id, nombre, imagen } = categoria;

  return (
    <div 
      className={`card-categoria-home categoria-${id}`}
      onClick={() => onSeleccionarCategoria(categoria)}
    >
      <div className="card-categoria-img">
        <img 
          src={imagen || `assets/categorias/${id}.webp`} 
          alt={nombre} 
          loading="lazy"
        />
      </div>

      <div className="card-categoria-info">
        <span className="card-categoria-nombre">{nombre}</span>
        <span className="card-categoria-arrow">›</span>
      </div>
    </div>
  );
};