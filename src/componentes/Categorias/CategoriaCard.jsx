import React from 'react';

export const CategoriaCard = ({ categoria, onSeleccionarCategoria }) => {
  const { id, nombre } = categoria;

  return (
    <div 
      className={`card-categoria-home categoria-${id}`}
      /* 🔴 CAMBIO AQUÍ: Pasamos el objeto 'categoria' completo en lugar de solo el 'id' */
      onClick={() => onSeleccionarCategoria(categoria)}
    >
      <div className="card-categoria-img">
        <img 
          src={`assets/categorias/${id}.webp`} 
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