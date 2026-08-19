import React, { useState } from 'react';
import { ControlesCantidad } from '../ControlesCantidad/ControlesCantidad.jsx';
import { ModalEliminar } from '../ModalEliminar/ModalEliminar.jsx';
import './ProductoCard.css';

export const ProductoCard = ({ 
  producto, 
  cantidad = 0, 
  onAgregar, 
  onRestar, 
  onEliminar, 
  onAbrir,
  className = ""
}) => {
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const stockMaximo = producto.stock ?? 0;
  const sinStock = stockMaximo <= 0;
  const alcanzoStock = stockMaximo > 0 && cantidad >= stockMaximo;

  const handleConfirmarEliminacion = () => {
    onEliminar?.(producto.id);
    setMostrarModalEliminar(false);
  };

  return (
    <>
      <div 
        className={`card card-producto ${className}`.trim()} 
        id={`producto-${producto.id}`}
        onClick={() => onAbrir?.(producto.id)}
      >
        <div className="top-card">
          <div className="imagen-producto">
            <img 
              src={producto.imagenes?.[0] || producto.img || ''} 
              alt={producto.nombre} 
              loading="lazy" 
            />
          </div>
        </div>

        <div className="info-producto">
          <div className="precio">${producto.precio}</div>
          <h3>{producto.nombre}</h3>
        </div>

        <div className="controles">
          <ControlesCantidad 
            cantidad={cantidad}
            sinStock={sinStock}
            alcanzoStock={alcanzoStock}
            onAgregar={() => onAgregar?.(producto.id)}
            onRestar={() => onRestar?.(producto.id)}
            onEliminar={() => setMostrarModalEliminar(true)} /* Abre la modal local */
          />
        </div>
      </div>

      {/* Modal de confirmación para esta tarjeta */}
      <ModalEliminar
        isOpen={mostrarModalEliminar}
        nombreProducto={producto.nombre}
        onClose={() => setMostrarModalEliminar(false)}
        onConfirm={handleConfirmarEliminacion}
      />
    </>
  );
};