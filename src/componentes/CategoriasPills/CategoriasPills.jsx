import React, { useEffect, useRef } from 'react';
import './CategoriasPills.css';

export const CategoriasPills = ({ 
  categorias = [], 
  loading = false, 
  categoriaSeleccionada = null, 
  onSeleccionarCategoria 
}) => {
  const scrollContainerRef = useRef(null);
  const activeItemRef = useRef(null);

  // Efecto para hacer scroll automático y centrar la píldora activa
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [categoriaSeleccionada, categorias]);

  if (loading || !categorias.length) return null;

  return (
    <div className="categorias-pills-wrapper">
      <div className="categorias-pills-scroll" ref={scrollContainerRef}>
        {categorias.map((cat) => {
          const esActiva = categoriaSeleccionada?.id === cat.id || categoriaSeleccionada?.nombre === cat.nombre;
          const fotoPill = cat.imagen || `assets/categorias/${cat.id}.webp`;

          return (
            <button
              key={cat.id}
              ref={esActiva ? activeItemRef : null} // Asignamos la referencia solo al elemento activo
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