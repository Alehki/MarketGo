import React, { useState, useEffect } from 'react';
import { ControlesCantidad } from '../ControlesCantidad/ControlesCantidad.jsx';
import { ModalEliminar } from '../ModalEliminar/ModalEliminar.jsx';
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
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  
  // Variables para detectar el deslizamiento táctil (swipe)
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // IMPORTANTE: Cada vez que abramos el modal o cambie el producto, reseteamos la foto visible a la primera (0)
  useEffect(() => {
    if (isOpen) {
      setImagenActiva(0);
    }
  }, [isOpen, producto?.id]);

  if (!isOpen || !producto) return null;

  const imagenes = Array.isArray(producto.imagenes) && producto.imagenes.length > 0 
    ? producto.imagenes 
    : [producto.imagen_url || producto.img || ''];

  const stockMaximo = producto.stock ?? 0;
  const sinStock = stockMaximo <= 0;
  const alcanzoStock = stockMaximo > 0 && cantidad >= stockMaximo;

  const handleConfirmarEliminacion = () => {
    onEliminar?.(producto.id);
    setMostrarModalEliminar(false);
    onClose?.();
  };

  // Navegación de fotos
  const fotoSiguiente = (e) => {
    e?.stopPropagation();
    setImagenActiva((prev) => (prev + 1) % imagenes.length);
  };

  const fotoAnterior = (e) => {
    e?.stopPropagation();
    setImagenActiva((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  // Manejo de gestos táctiles (Swipe en celulares)
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distancia = touchStart - touchEnd;
    const esSwipeIzquierda = distancia > 50;  // Deslizar hacia la izquierda -> Siguiente foto
    const esSwipeDerecha = distancia < -50; // Deslizar hacia la derecha -> Foto anterior

    if (esSwipeIzquierda && imagenes.length > 1) {
      fotoSiguiente();
    }
    if (esSwipeDerecha && imagenes.length > 1) {
      fotoAnterior();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-detalle-content" onClick={(e) => e.stopPropagation()}>
          <button className="btn-cerrar" onClick={onClose}>✕</button>

          {/* Galería de Imágenes */}
          <div className="galeria-imagenes">
            <div 
              className="imagen-principal-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Flechas táctiles / escritorio (solo si hay más de 1 imagen) */}
              {imagenes.length > 1 && (
                <>
                  <button className="flecha-modal flecha-izq" onClick={fotoAnterior}>‹</button>
                  <button className="flecha-modal flecha-der" onClick={fotoSiguiente}>›</button>
                </>
              )}

              <img 
                src={imagenes[imagenActiva]} 
                alt={producto.nombre} 
                className="imagen-principal"
              />
            </div>

            {/* Indicadores / Dots */}
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
                onEliminar={() => setMostrarModalEliminar(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalEliminar
        isOpen={mostrarModalEliminar}
        nombreProducto={producto.nombre}
        onClose={() => setMostrarModalEliminar(false)}
        onConfirm={handleConfirmarEliminacion}
      />
    </>
  );
};