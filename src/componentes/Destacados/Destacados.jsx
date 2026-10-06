import React from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { SkeletonCard } from '../skeletons/SkeletonCard/SkeletonCard.jsx'; // 🟢 Ajusta esta ruta si es necesario
import './Destacados.css';

export const Destacados = ({ 
  productos = [], 
  carrito = {}, 
  onAgregar, 
  onRestar, 
  onEliminar,
  onAbrirProducto,
  loading = false // 🟢 Recibe la prop
}) => {
  // Si está cargando, creamos 4 elementos fantasmas para la cinta
  const cantidadSkeletons = 4;
  const elementosVisibles = loading 
    ? Array.from({ length: cantidadSkeletons }) 
    : productos;

  // Si no está cargando y no hay productos, ocultamos la sección
  if (!loading && (!productos || productos.length === 0)) {
    return null;
  }

  return (
    <section className="seccion-destacados">
      {/* Caja amarilla de fondo */}
      <div className="caja-amarilla-fondo" />

      {/* Capa de contenido por encima */}
      <div className="capa-contenido">
        <h2 className="titulo-seccion">Destacados</h2>

        <div className="cinta-scroll">
          {elementosVisibles.map((item, index) => {
            if (loading) {
              return (
                <SkeletonCard 
                  key={`skeleton-destacado-${index}`} 
                  className="card-destacado" // 👈 Mantiene el ancho fijo de 145px en la cinta
                />
              );
            }

            const producto = item;
            const cantidad = carrito[producto.id]?.cantidad || 0;

            return (
              <ProductoCard
                key={producto.id}
                producto={producto}
                cantidad={cantidad}
                className="card-destacado"
                onAgregar={() => onAgregar(producto.id, producto)}
                onRestar={() => onRestar(producto.id)}
                onEliminar={() => onEliminar(producto.id)}
                onAbrir={onAbrirProducto}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};