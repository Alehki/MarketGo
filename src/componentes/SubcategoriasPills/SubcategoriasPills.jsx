import React from 'react';
import './SubcategoriasPills.css'; // Puedes reutilizar o adaptar los estilos de las píldoras

export const SubcategoriasPills = ({ 
  subcategorias = [], 
  loading = false, 
  subcategoriaSeleccionada = null, 
  onSeleccionarSubcategoria 
}) => {
  // Si está cargando o no hay subcategorías para esta categoría, no renderizamos nada
  if (loading || !subcategorias.length) return null;

  return (
    <div className="subcategorias-pills-wrapper">
      <div className="subcategorias-pills-scroll">
        {/* Opcional: Un botón de "Todas" para deseleccionar la subcategoría */}
        <button
          className={`subcategoria-pill-item ${!subcategoriaSeleccionada ? 'activa' : ''}`}
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