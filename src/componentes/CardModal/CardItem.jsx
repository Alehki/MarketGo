import React, { useState } from 'react';
import { ControlesCantidad } from '../ControlesCantidad/ControlesCantidad.jsx';

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

  return (
    <div className="item-carrito">
      {/* Botón de eliminar detrás del swipe */}
      <div 
        className="item-eliminar" 
        onClick={() => onPedirEliminar?.(itemKey, item)}
      >
        🗑
      </div>

      {/* Capa de contenido frontal que se desliza */}
      <div 
        className="item-contenido"
        style={{ 
          transform: `translateX(${swipeOffset}px)`, 
          transition: swipeOffset === 0 || swipeOffset === -60 ? 'transform 0.2s' : 'none' 
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="item-info">
          <strong>
            {item.nombre}
            {item.color ? ` (${item.color})` : ''}
          </strong>
          <span>{` $${item.precio} x ${item.cantidad}`}</span>
        </div>

        {/* Controles de Cantidad */}
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
  );
};