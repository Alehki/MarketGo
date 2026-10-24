import React, { useState, useRef } from 'react';
import { CardItem } from './CardItem.jsx';
import { ModalEliminar } from '../ModalEliminar/ModalEliminar.jsx';
import styles from './CartFullScreen.module.css';

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
  estadoTienda = 'abierto'
}) => {
  const [itemAEliminar, setItemAEliminar] = useState(null);

  // Referencia para congelar el último monto positivo antes de ocultar o cerrar
  const ultimoFaltaParaMinimoRef = useRef(faltaParaMinimo);

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

  // Mostramos el monto positivo real o el valor congelado previo
  const montoAMostrar = faltaParaMinimo > 0 ? faltaParaMinimo : ultimoFaltaParaMinimoRef.current;

  // Condición estricta: Mostrar alerta solo si la tienda está cerrada O si hay productos y NO se cumple el mínimo
  const mostrarAlerta = estadoTienda === 'cerrado' || (entries.length > 0 && !cumpleMinimo);

  return (
    <div className={styles.cartFullscreenContainer}>
      {/* Header Superior */}
      <header className={styles.cartFullscreenHeader}>
        <button className={styles.cartBackBtn} onClick={onClose} aria-label="Volver">
          ✕
        </button>
        <h2 className={styles.cartFullscreenTitle}>Tu carrito</h2>
        <div className={styles.cartHeaderSpacer}></div>
      </header>

      {/* Cuerpo principal con scroll */}
      <div className={styles.cartFullscreenBody}>
        {/* Lista de productos */}
        <div className={styles.cartFullscreenItems}>
          {entries.length === 0 ? (
            <div className={styles.cartFullscreenEmpty}>
              <span className={styles.emptyIcon}>🛒</span>
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

        {/* Mensaje condicional animado */}
        <div className={`${styles.cartAlertWrapper} ${mostrarAlerta ? styles.visible : ''}`}>
          {estadoTienda === 'cerrado' ? (
            <div className={`${styles.cartAlertBox} ${styles.closed}`}>
              <p>Estamos cerrados 🕒</p>
            </div>
          ) : (
            <div className={`${styles.cartAlertBox} ${styles.warning}`}>
              <p>Agregá ${montoAMostrar} más para poder pedir</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Fijo Abajo */}
      <footer className={styles.cartFullscreenFooter}>
        <div className={styles.cartSummaryRow}>
          <span>Subtotal</span>
          <span className={styles.cartSummaryTotalPrice}>${total}</span>
        </div>

        <button
          className={styles.cartCheckoutBtn}
          disabled={estaBotonDeshabilitado}
          onClick={onIrAPagar}
        >
          Ir a pagar
        </button>
      </footer>

      {/* Modal de confirmación */}
      <ModalEliminar
        isOpen={Boolean(itemAEliminar)}
        nombreProducto={itemAEliminar?.item?.nombre}
        onClose={() => setItemAEliminar(null)}
        onConfirm={confirmarEliminacion}
      />
    </div>
  );
};