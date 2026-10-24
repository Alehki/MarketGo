import React from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { SkeletonCard } from '../skeletons/SkeletonCard/SkeletonCard.jsx';
import styles from './Destacados.module.css'; // Importación modular

export const Destacados = ({ 
  productos = [], 
  carrito = {}, 
  onAgregar, 
  onRestar, 
  onEliminar,
  onAbrirProducto,
  loading = false
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
    <section className={styles.seccionDestacados}>
      {/* Caja amarilla de fondo */}
      <div className={styles.cajaAmarillaFondo} />

      {/* Capa de contenido por encima */}
      <div className={styles.capaContenido}>
        <h2 className={styles.tituloSeccion}>Destacados</h2>

        <div className={styles.cintaScroll}>
          {elementosVisibles.map((item, index) => {
            if (loading) {
              return (
                <SkeletonCard 
                  key={`skeleton-destacado-${index}`} 
                  className={styles.cardDestacado} // Ancho fijo de 145px en la cinta
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
                className={styles.cardDestacado}
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