import React, { useState } from 'react';
import { CardItem } from './CardItem.jsx';
import { ModalEliminar } from '../ModalEliminar/ModalEliminar.jsx';
import './CardModal.css';

export const CardModal = ({
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
  const [itemAEliminar, setItemAEliminar] = useState(null); // { key, item }

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

  return (
    <>
      <div id="modalCarrito" className="modal">
        <div className="modal-content">
          <button className="cerrar" id="cerrarCarrito" onClick={onClose}>
            ✕
          </button>

          <h2 className="tituloCarrito">Tu carrito</h2>

          {/* Lista de productos */}
          <div id="carrito-items" className="carrito-items">
            {entries.length === 0 ? (
              <p className="cart-vacio">Tu carrito está vacío 🛒</p>
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

          {/* Resumen */}
          <div id="resumenCarrito" className="resumen-carrito">
            <div className="resumen-linea">
              <span>Productos</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Mensajes condicionales */}
          {estadoTienda === 'cerrado' ? (
            <p className="mensaje-minimo show">Estamos cerrados 🕒</p>
          ) : !cumpleMinimo && entries.length > 0 ? (
            <p id="mensajeCompraMinima" className="mensaje-minimo show">
              Agregá ${faltaParaMinimo} para poder pedir
            </p>
          ) : null}

          {/* Total */}
          <div className="total">
            SubTotal: $<span id="total">{total}</span>
          </div>

          {/* Botón Ir a Pagar */}
          <button
            id="revisarPedido"
            className="btn-principal"
            disabled={estaBotonDeshabilitado}
            onClick={onIrAPagar}
          >
            Ir a pagar
          </button>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <ModalEliminar
        isOpen={Boolean(itemAEliminar)}
        nombreProducto={itemAEliminar?.item?.nombre}
        onClose={() => setItemAEliminar(null)}
        onConfirm={confirmarEliminacion}
      />
    </>
  );
};