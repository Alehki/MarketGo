import React from 'react';
import styles from './ControlesCantidad.module.css';

export const ControlesCantidad = ({
  cantidad = 0,
  sinStock = false,
  alcanzoStock = false,
  onAgregar,
  onRestar,
  onEliminar,
  size = 'normal', // 'normal' | 'small'
  className = ''
}) => {
  const sizeClass = size === 'small' ? styles.isSmall : '';

  return (
    <div className={`${styles.controlesCantidad} ${sizeClass} ${className}`.trim()}>
      {cantidad === 0 ? (
        <button 
          type="button"
          className={styles.btnAgregar}
          disabled={sinStock || alcanzoStock}
          onClick={(e) => {
            e.stopPropagation();
            onAgregar?.();
          }}
        >
          {sinStock ? 'Sin stock' : alcanzoStock ? 'Máximo' : 'Agregar'}
        </button>
      ) : (
        <div className={styles.selectorCantidad}>
          {cantidad === 1 ? (
            <button 
              type="button"
              className={`${styles.btnIcon} ${styles.danger}`} 
              title="Eliminar del carrito"
              onClick={(e) => {
                e.stopPropagation();
                onEliminar?.();
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M9 3h6M4 7h16M6 7l1 14h10l1-14"/>
              </svg>
            </button>
          ) : (
            <button 
              type="button"
              className={styles.btnIcon} 
              title="Restar uno"
              onClick={(e) => {
                e.stopPropagation();
                onRestar?.();
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M5 12h14"/>
              </svg>
            </button>
          )}

          <span className={styles.cantidadNum}>{cantidad}</span>

          <button 
            type="button"
            className={`${styles.btnIcon} ${styles.primary}`} 
            disabled={alcanzoStock}
            title="Sumar uno"
            onClick={(e) => {
              e.stopPropagation();
              onAgregar?.();
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};