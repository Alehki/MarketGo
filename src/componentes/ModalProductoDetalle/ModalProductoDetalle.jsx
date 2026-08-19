import React, { useState } from 'react';
import { ControlesCantidad } from '../ControlesCantidad/ControlesCantidad.jsx';
import { ModalEliminar } from '../ModalEliminar/ModalEliminar.jsx'; // Importamos tu modal de eliminar
import './ModalProductoDetalle.css';

export const ModalProductoDetalle = ({ 
  producto, 
  isOpen, 
  onClose, 
  cantidad = 0,
  onAgregar,
  onRestar,
  onEliminar 
}) => {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false); // Estado para la modal de eliminación

  if (!isOpen || !producto) return null;

  const imagenes = producto.imagenes?.length ? producto.imagenes : [producto.img || ''];
  const stockMaximo = producto.stock ?? 0;
  const sinStock = stockMaximo <= 0;
  const alcanzoStock = stockMaximo > 0 && cantidad >= stockMaximo;

  // Confirmación desde la modal
  const handleConfirmarEliminacion = () => {
    onEliminar?.(producto.id);
    setMostrarModalEliminar(false);
    onClose?.();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-detalle-content" onClick={(e) => e.stopPropagation()}>
          <button className="btn-cerrar" onClick={onClose}>✕</button>

          {/* Galería de Imágenes */}
          <div className="galeria-imagenes">
            <div className="imagen-principal-container">
              <img 
                src={imagenes[imagenActiva]} 
                alt={producto.nombre} 
                className="imagen-principal"
              />
            </div>

            {imagenes.length > 1 && (
              <div className="indicadores-galeria">
                {imagenes.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === imagenActiva ? 'active' : ''}`}
                    onClick={() => setImagenActiva(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="detalle-info">
            <h2>{producto.nombre}</h2>
            <p className="detalle-precio">${producto.precio}</p>
            
            {producto.descripcion && (
              <p className="detalle-descripcion">{producto.descripcion}</p>
            )}

            {/* Controles de Cantidad */}
            <div className="detalle-acciones">
              <ControlesCantidad 
                cantidad={cantidad}
                sinStock={sinStock}
                alcanzoStock={alcanzoStock}
                onAgregar={() => onAgregar?.(producto)}
                onRestar={() => onRestar?.(producto.id)}
                onEliminar={() => setMostrarModalEliminar(true)} /* Abre tu ModalEliminar */
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tu componente reutilizable de confirmación */}
      <ModalEliminar
        isOpen={mostrarModalEliminar}
        nombreProducto={producto.nombre}
        onClose={() => setMostrarModalEliminar(false)}
        onConfirm={handleConfirmarEliminacion}
      />
    </>
  );
};