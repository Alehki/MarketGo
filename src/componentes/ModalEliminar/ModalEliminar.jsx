import React from 'react';
import './ModalEliminar.css';

export const ModalEliminar = ({ isOpen, onClose, onConfirm, nombreProducto }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay-confirmacion" onClick={onClose}>
      <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
        <h3>¿Eliminar producto?</h3>
        <p>¿Estás seguro de que quieres quitar <strong>{nombreProducto}</strong> del carrito?</p>
        
        <div className="acciones-modal">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-eliminar" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};