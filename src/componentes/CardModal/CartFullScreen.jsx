import React, { useState, useRef } from 'react';
import { CardItem } from './CardItem.jsx';
import { ModalEliminar } from '../ModalEliminar/ModalEliminar.jsx';
import './CartFullScreen.css'; // Nuevos estilos dedicados

export const CartFullScreen = ({
  isOpen,
  onClose,
  carrito,
  total,
  faltaParaMinimo,
  cumpleMinimo,
  onAgregar,
  onRestar,
  onEliminar,
  onIrAPagar,
  estadoTienda = 'abierto' // 'abierto', 'cerrado'
}) => {
  const [itemAEliminar, setItemAEliminar] = useState(null);

  // Referencia para congelar el último monto positivo antes de la animación de cierre
  const ultimoFaltaParaMinimoRef = useRef(faltaParaMinimo);

  // Si faltaParaMinimo es mayor a 0, actualizamos el valor guardado
  if (faltaParaMinimo > 0) {
    ultimoFaltaParaMinimoRef.current = faltaParaMinimo;
  }

  if (!isOpen) return null;

  const entries = Object.entries(carrito);

  const solicitarEliminacion = (key, item) => {
    setItemAEliminar({ key, item });
  };

  const confirmarEliminacion = () => {
    if (itemAEliminar) {
      onEliminar(itemAEliminar.key);
      setItemAEliminar(null);
    }
  };

  const estaBotonDeshabilitado = !cumpleMinimo || estadoTienda === 'cerrado' || entries.length === 0;

  // Definimos la variable que decide si muestra el valor actual o el congelado
  const montoAMostrar = faltaParaMinimo > 0 ? faltaParaMinimo : ultimoFaltaParaMinimoRef.current;

  return (
    <div className="cart-fullscreen-container">
      {/* Header Superior con botón de cierre (flecha o cruz) y título */}
      <header className="cart-fullscreen-header">
        <button className="cart-back-btn" onClick={onClose} aria-label="Volver">
          ✕
        </button>
        <h2 className="cart-fullscreen-title">Tu carrito</h2>
        <div className="cart-header-spacer"></div> {/* Para equilibrar el espacio */}
      </header>

      {/* Contenido principal con scroll */}
      <div className="cart-fullscreen-body">
        {/* Lista de productos */}
        <div className="cart-fullscreen-items">
          {entries.length === 0 ? (
            <div className="cart-fullscreen-empty">
              <span className="empty-icon">🛒</span>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            entries.map(([key, item]) => (
              <CardItem
                key={key}
                itemKey={key}
                item={item}
                onAgregar={onAgregar}
                onRestar={onRestar}
                onPedirEliminar={solicitarEliminacion}
              />
            ))
          )}
        </div>

        {/* Mensaje condicional con contenedor animado (Entrada y Salida suave) */}
        <div className={`cart-alert-wrapper ${((!cumpleMinimo && entries.length > 0) || estadoTienda === 'cerrado') ? 'visible' : ''}`}>
          {estadoTienda === 'cerrado' ? (
            <div className="cart-alert-box closed">
              <p>Estamos cerrados 🕒</p>
            </div>
          ) : (
            <div className="cart-alert-box warning">
              <p>Agregá ${montoAMostrar} más para poder pedir</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Fijo Abajo con Resumen y Botón de Pago */}
      <footer className="cart-fullscreen-footer">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span className="cart-summary-total-price">${total}</span>
        </div>

        <button
          className="cart-checkout-btn"
          disabled={estaBotonDeshabilitado}
          onClick={onIrAPagar}
        >
          Ir a pagar
        </button>
      </footer>

      {/* Modal de confirmación para eliminar (se mantiene intacto) */}
      <ModalEliminar
        isOpen={Boolean(itemAEliminar)}
        nombreProducto={itemAEliminar?.item?.nombre}
        onClose={() => setItemAEliminar(null)}
        onConfirm={confirmarEliminacion}
      />
  </div>
  );
};