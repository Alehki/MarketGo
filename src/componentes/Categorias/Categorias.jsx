import React, { useState } from 'react';
import { CategoriaCard } from './CategoriaCard.jsx';
import './Categorias.css';

export const Categorias = ({ categorias = [], loading = false, onSeleccionarCategoria }) => {
  // 🟢 Estado para controlar si se muestran todas o solo un límite inicial
  const [mostrarTodas, setMostrarTodas] = useState(false);

  // 🟢 Define cuántas categorías se ven por defecto (puedes cambiarlo a 6, 8, etc.)
  const LIMITE_INICIAL = 6;

  if (loading) {
    return <p className="mensaje-estado">Cargando categorías...</p>;
  }

  // Si no hay categorías, puedes manejarlo o dejar que el grid quede vacío
  if (!categorias || categorias.length === 0) {
    return null;
  }

  // Cortamos el array si "mostrarTodas" es falso
  const categoriasVisibles = mostrarTodas 
    ? categorias 
    : categorias.slice(0, LIMITE_INICIAL);

  // Verificamos si hay más categorías que el límite para mostrar u ocultar el botón
  const hayMasCategorias = categorias.length > LIMITE_INICIAL;

  return (
    <section className="seccion-categorias">
      <h2 className="titulo-seccion">Categorías</h2>
      
      <div className="grid-categorias" id="gridCategorias">
        {categoriasVisibles.map((cat) => (
          <CategoriaCard
            key={cat.id}
            categoria={cat}
            onSeleccionarCategoria={onSeleccionarCategoria}
          />
        ))}
      </div>

      {/* 🟢 Botón Mostrar más / Mostrar menos */}
      {hayMasCategorias && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            onClick={() => setMostrarTodas(!mostrarTodas)}
            className="btn-mostrar-mas"
          >
            {mostrarTodas ? 'Mostrar menos ▲' : 'Mostrar más ▼'}
          </button>
        </div>
      )}
    </section>
  );
};