import React, { useState } from 'react';
import { ControlesCantidad } from '../ControlesCantidad/ControlesCantidad.jsx';
import styles from './CardItemFullScreen.module.css'; // Importación como CSS Module

export const CardItem = ({ itemKey, item, onAgregar, onRestar, onPedirEliminar }) => {
  const [startX, setStartX] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Manejo de eventos Touch para el deslizado (Swipe)
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (diff > 0 && diff <= 80) {
      setSwipeOffset(-diff);
    } else if (diff <= 0) {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -40) {
      setSwipeOffset(-60); // Deja expuesto el botón de eliminar
    } else {
      setSwipeOffset(0);
    }
  };

  const stockMaximo = item.stock ?? 0;
  const alcanzoStock = stockMaximo > 0 && item.cantidad >= stockMaximo;

  // Detectar si hay imagen en la prop del producto
  const imagenUrl = item.imagen || item.imagen_url || item.foto;

  return (
    <div className={styles.itemCarritoContainer}>
      {/* Botón de eliminar detrás del swipe */}
      <div 
        className={styles.itemEliminarBg} 
        onClick={() => onPedirEliminar?.(itemKey, item)}
      >
        🗑
      </div>

      {/* Capa de contenido frontal que se desliza */}
      <div 
        className={styles.itemContenidoCard}
        style={{ 
          transform: `translateX(${swipeOffset}px)`, 
          transition: swipeOffset === 0 || swipeOffset === -60 ? 'transform 0.2s ease-out' : 'none' 
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imagen del producto (si existe) */}
        {imagenUrl && (
          <div className={styles.itemImagenWrapper}>
            <img src={imagenUrl} alt={item.nombre} className={styles.itemImagen} />
          </div>
        )}

        {/* Info del producto */}
        <div className={styles.itemInfoMain}>
          <strong className={styles.itemNombre}>
            {item.nombre}
            {item.color ? ` (${item.color})` : ''}
          </strong>
          
          <div className={styles.itemPrecios}>
            <span className={styles.itemPrecioUnitario}>
              ${item.precio} <small>x {item.cantidad}</small>
            </span>
            <span className={styles.itemPrecioSubtotal}>
              ${(item.precio * item.cantidad).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Controles de Cantidad */}
        <div className={styles.itemControlesWrapper}>
          <ControlesCantidad 
            size="small"
            cantidad={item.cantidad}
            alcanzoStock={alcanzoStock}
            onAgregar={() => onAgregar?.(item, item.color)}
            onRestar={() => onRestar?.(itemKey)}
            onEliminar={() => onPedirEliminar?.(itemKey, item)}
          />
        </div>
      </div>
    </div>
  );
};