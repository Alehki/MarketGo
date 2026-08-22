import React from 'react';
import './CategoriasPills.css';

export const CategoriasPills = ({ 
  categorias = [], 
  loading = false, 
  categoriaSeleccionada = null, 
  onSeleccionarCategoria 
}) => {
  if (loading || !categorias.length) return null;

  return (
    <div className="categorias-pills-wrapper">
      <div className="categorias-pills-scroll">
        {categorias.map((cat) => {
          // Comparamos si esta píldora es la categoría activa actualmente
          const esActiva = categoriaSeleccionada?.id === cat.id || categoriaSeleccionada?.nombre === cat.nombre;

          // Usa la URL dinámica de Supabase (cat.imagen) o recurre al fallback local
          const fotoPill = cat.imagen || `assets/categorias/${cat.id}.webp`;

          return (
            <button
              key={cat.id}
              className={`categoria-pill-item ${esActiva ? 'activa' : ''}`}
              type="button"
              onClick={() => onSeleccionarCategoria(cat)}
            >
              <img
                src={fotoPill}
                alt={cat.nombre}
                className="categoria-pill-img"
                loading="lazy"
                onError={(e) => {
                  // Fallback visual por si falla la carga de la imagen
                  e.target.style.display = 'none';
                }}
              />
              <span className="categoria-pill-nombre">{cat.nombre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriasPills;