import React, { useState } from 'react';
import { ModalPedidoExitoso } from '../ModalPedidoExitoso/ModalPedidoExitoso.jsx';
import './ModalResumenPedido.css';

export const ModalResumenPedido = ({ 
  isOpen, 
  onClose, 
  onVolver, 
  carrito, 
  total,
  costoEnvio = 900,
  onEnviarWhatsApp 
}) => {
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [mostrarExito, setMostrarExito] = useState(false);

  if (!isOpen && !mostrarExito) return null;

  const itemsCarrito = Array.isArray(carrito) 
    ? carrito 
    : Object.values(carrito || {});

  const subtotal = total || 0;
  const totalFinal = subtotal + costoEnvio;

  const esFormularioValido = direccion.trim() !== '' && metodoPago !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!esFormularioValido) return;

    // 1. Mostrar la animación inmediatamente
    setMostrarExito(true);

    // 2. Esperar 1.8 segundos para que la animación termine y enviar a WhatsApp
    setTimeout(() => {
      onEnviarWhatsApp({
        direccion,
        referencia,
        metodoPago,
        items: itemsCarrito,
        subtotal,
        costoEnvio,
        totalFinal
      });
      setMostrarExito(false);
      onClose(); // Cierra los modales
    }, 2600);
  };

  return (
    <>
      {isOpen && !mostrarExito && (
        <div className="modal-overlay">
          <div className="modal-contenido modal-resumen">
            {/* Encabezado */}
            <div className="modal-resumen-header">
              <button type="button" className="btn-icono-flecha" onClick={onVolver} aria-label="Volver al carrito">
                ←
              </button>
              <button type="button" className="btn-icono-cerrar" onClick={onClose} aria-label="Cerrar modal">
                ✕
              </button>
            </div>

            <h2 className="modal-resumen-titulo">Resumen del pedido</h2>

            <form onSubmit={handleSubmit} className="resumen-form">
              <div className="form-group">
                <input
                  type="text"
                  className="input-resumen"
                  placeholder="Dirección (obligatoria)"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className="input-resumen"
                  placeholder="Referencia (opcional)"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </div>

              <div className="form-group">
                <select 
                  className="select-resumen"
                  value={metodoPago} 
                  onChange={(e) => setMetodoPago(e.target.value)}
                  required
                >
                  <option value="" disabled>Seleccioná un método de pago</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia bancaria</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                </select>
              </div>

              {/* Lista resumida de productos */}
              <div className="resumen-items-lista">
                {itemsCarrito.map((item) => (
                  <div key={item.id} className="resumen-item-row">
                    <span className="item-nombre">{item.nombre}</span>
                    <span className="item-cantidad">x{item.cantidad}</span>
                  </div>
                ))}
              </div>

              {/* Tarjeta de Totales */}
              <div className="resumen-totales-card">
                <div className="totales-row">
                  <span>Productos</span>
                  <span>${subtotal}</span>
                </div>
                <div className="totales-row">
                  <span>Envío</span>
                  <span>${costoEnvio}</span>
                </div>
                <hr className="divider-totales" />
                <div className="totales-row total-destacado">
                  <strong>Total</strong>
                  <strong>${totalFinal}</strong>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-principal btn-enviar-wa" 
                disabled={!esFormularioValido}
              >
                Confirmar pedido
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de animación táctil */}
      {mostrarExito && (
        <ModalPedidoExitoso 
          onCerrar={() => {
            setMostrarExito(false);
            onClose();
          }} 
        />
      )}
    </>
  );
};