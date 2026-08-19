import React from 'react';
import { CategoriaCard } from './CategoriaCard.jsx';
import './Categorias.css';

export const Categorias = ({ categorias = [], loading = false, onSeleccionarCategoria }) => {
  if (loading) {
    return <p className="mensaje-estado">Cargando categorías...</p>;
  }

  return (
    <section className="seccion-categorias">
      <h2 className="titulo-seccion">Categorías</h2>
      
      <div className="grid-categorias" id="gridCategorias">
        {categorias.map((cat) => (
          <CategoriaCard
            key={cat.id}
            categoria={cat}
            onSeleccionarCategoria={onSeleccionarCategoria}
          />
        ))}
      </div>
    </section>
  );
};