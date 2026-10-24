import React, { useState } from 'react';
import { ModalPedidoExitoso } from '../ModalPedidoExitoso/ModalPedidoExitoso.jsx';
import './OrderSummaryFullScreen.css';

export const OrderSummaryFullScreen = ({ 
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
  // 1. Agregamos un estado para el botón de carga
  const [cargandoPago, setCargandoPago] = useState(false);

  if (!isOpen && !mostrarExito) return null;

  const itemsCarrito = Array.isArray(carrito) 
    ? carrito 
    : Object.values(carrito || {});

  const subtotal = total || 0;
  const totalFinal = subtotal + costoEnvio;

  const esFormularioValido = direccion.trim() !== '' && metodoPago !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!esFormularioValido || cargandoPago) return;

    if (metodoPago === "Mercado Pago") {
      setCargandoPago(true); // Activamos el estado de carga
      try {
        await onEnviarWhatsApp({
          direccion,
          referencia,
          metodoPago,
          items: itemsCarrito,
          subtotal,
          costoEnvio,
          totalFinal
        });
        // Nota: Si redirige exitoso, la página cambia, 
        // pero por si tarda un segundo más, mantenemos el estado
      } catch (error) {
        setCargandoPago(false); // Si hay error, liberamos el botón
      }
      return;
    }

    // --- FLUJO NORMAL (Efectivo / Transferencia) ---
    setMostrarExito(true);
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
      onClose();
    }, 2600);
  };

  return (
    <>
      {isOpen && !mostrarExito && (
        <div className="order-summary-fullscreen-container">
          {/* Header Superior con botón de volver, título y cerrar */}
          <header className="order-summary-header">
            <button 
              type="button" 
              className="summary-header-btn" 
              onClick={onVolver} 
              aria-label="Volver al carrito"
            >
              ←
            </button>
            <h2 className="summary-header-title">Ya casi estamos listos</h2>
            <button 
              type="button" 
              className="summary-header-btn" 
              onClick={onClose} 
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </header>

          {/* Formulario y Contenido Scrolleable */}
          <form onSubmit={handleSubmit} className="order-summary-form">
            <div className="order-summary-body">
              {/* Sección: Datos de Entrega */}
              <section className="summary-section">
                <h3 className="section-label">Datos de entrega</h3>
                <div className="form-group-custom">
                  <input
                    type="text"
                    className="input-custom"
                    placeholder="Dirección (obligatoria)"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-custom">
                  <input
                    type="text"
                    className="input-custom"
                    placeholder="Referencia o timbre (opcional)"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                  />
                </div>
              </section>

              {/* Sección: Método de Pago */}
              <section className="summary-section">
                <h3 className="section-label">Forma de pago</h3>
                <div className="form-group-custom select-wrapper">
                  <select 
                    className="select-custom"
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
              </section>

              {/* Sección: Productos Seleccionados */}
              <section className="summary-section">
                <h3 className="section-label">Detalle de productos</h3>
                <div className="summary-items-card">
                  {itemsCarrito.map((item, index) => (
                    <div key={item.id || item.itemKey || index} className="summary-item-row">
                      <span className="summary-item-nombre">{item.nombre}</span>
                      <span className="summary-item-cantidad">x{item.cantidad}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tarjeta de Desglose de Costos */}
              <section className="summary-section">
                <div className="summary-totals-card">
                  <div className="totals-row">
                    <span>Productos</span>
                    <span>${subtotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="totals-row">
                    <span>Envío</span>
                    <span>${costoEnvio.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="totals-divider"></div>
                  <div className="totals-row total-highlight">
                    <strong>Total</strong>
                    <strong>${totalFinal.toLocaleString('es-AR')}</strong>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Fijo con el Botón de Confirmación */}
            <footer className="order-summary-footer">
              <button 
                type="submit" 
                className="summary-submit-btn" 
                disabled={!esFormularioValido || cargandoPago}
              >
                {cargandoPago ? "Conectando con Mercado Pago..." : "Confirmar pedido"}
              </button>
            </footer>
          </form>
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