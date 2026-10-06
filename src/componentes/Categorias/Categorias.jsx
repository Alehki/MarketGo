import React, { useState } from 'react';
import { CategoriaCard } from './CategoriaCard.jsx';
import { SkeletonCategoriaCard } from '../skeletons/SkeletonCategoriaCard/SkeletonCategoriaCard.jsx'; // 🟢 Importamos el esqueleto
import './Categorias.css';

export const Categorias = ({ categorias = [], loading = false, onSeleccionarCategoria }) => {
  // 🟢 Estado para controlar si se muestran todas o solo un límite inicial
  const [mostrarTodas, setMostrarTodas] = useState(false);

  // 🟢 Define cuántas categorías se ven por defecto
  const LIMITE_INICIAL = 6;

  // Si no hay categorías y tampoco está cargando, ocultamos la sección
  if (!loading && (!categorias || categorias.length === 0)) {
    return null;
  }

  // 🟢 Si está cargando, generamos un array fantasma de tamaño LIMITE_INICIAL para los esqueletos
  const categoriasVisibles = loading 
    ? Array.from({ length: LIMITE_INICIAL }) 
    : (mostrarTodas ? categorias : categorias.slice(0, LIMITE_INICIAL));

  // Verificamos si hay más categorías (solo si ya terminó de cargar)
  const hayMasCategorias = !loading && categorias.length > LIMITE_INICIAL;

  return (
    <section className="seccion-categorias">
      <h2 className="titulo-seccion">Categorías</h2>
      
      <div className="grid-categorias" id="gridCategorias">
        {categoriasVisibles.map((cat, index) => (
          loading ? (
            // 🟢 Renderizamos el esqueleto mientras dura la carga
            <SkeletonCategoriaCard key={`skeleton-${index}`} />
          ) : (
            // 🟢 Renderizamos la tarjeta real cuando los datos estén listos
            <CategoriaCard
              key={cat.id}
              categoria={cat}
              onSeleccionarCategoria={onSeleccionarCategoria}
            />
          )
        ))}
      </div>

      {/* 🟢 Zona inferior fija con altura reservada para el botón o su esqueleto */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', minHeight: '40px' }}>
        {loading ? (
          <div className="skeleton-btn-mostrar-mas"></div>
        ) : hayMasCategorias ? (
          <button 
            onClick={() => setMostrarTodas(!mostrarTodas)}
            className="btn-mostrar-mas"
          >
            {mostrarTodas ? 'Mostrar menos ▲' : 'Mostrar más ▼'}
          </button>
        ) : null}
      </div>
    </section>
  );
};