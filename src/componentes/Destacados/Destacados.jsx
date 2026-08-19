import React from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import './Destacados.css';

export const Destacados = ({ 
  productos = [], 
  carrito = {}, 
  onAgregar, 
  onRestar, 
  onEliminar,
  onAbrirProducto 
}) => {
  return (
    <section className="seccion-destacados">
      {/* Caja amarilla de fondo */}
      <div className="caja-amarilla-fondo" />

      {/* Capa de contenido por encima */}
      <div className="capa-contenido">
        <h2 className="titulo-seccion">Destacados</h2>

        <div className="cinta-scroll">
          {productos.map((producto) => {
            const cantidad = carrito[producto.id]?.cantidad || 0;

            return (
              <ProductoCard
                key={producto.id}
                producto={producto}
                cantidad={cantidad}
                className="card-destacado" // 👈 Aplica el ancho fijo de 145px
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