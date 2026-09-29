import React, { useEffect, useRef } from 'react';
import './SubcategoriasPills.css';

export const SubcategoriasPills = ({ 
  subcategorias = [], 
  loading = false, 
  subcategoriaSeleccionada = null, 
  onSeleccionarSubcategoria 
}) => {
  const scrollContainerRef = useRef(null);
  const activeItemRef = useRef(null);

  // Efecto para hacer scroll automático y centrar la píldora activa (incluyendo "Todas")
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [subcategoriaSeleccionada, subcategorias]);

  // Si está cargando o no hay subcategorías para esta categoría, no renderizamos nada
  if (loading || !subcategorias.length) return null;

  const esTodasActiva = !subcategoriaSeleccionada;

  return (
    <div className="subcategorias-pills-wrapper">
      <div className="subcategorias-pills-scroll" ref={scrollContainerRef}>
        {/* Botón de "Todas" */}
        <button
          ref={esTodasActiva ? activeItemRef : null}
          className={`subcategoria-pill-item ${esTodasActiva ? 'activa' : ''}`}
          type="button"
          onClick={() => onSeleccionarSubcategoria(null)}
        >
          <span className="subcategoria-pill-nombre">Todas</span>
        </button>

        {subcategorias.map((subcat) => {
          const esActiva = subcategoriaSeleccionada?.id === subcat.id;

          return (
            <button
              key={subcat.id}
              ref={esActiva ? activeItemRef : null}
              className={`subcategoria-pill-item ${esActiva ? 'activa' : ''}`}
              type="button"
              onClick={() => onSeleccionarSubcategoria(subcat)}
            >
              <span className="subcategoria-pill-nombre">{subcat.nombre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubcategoriasPills;