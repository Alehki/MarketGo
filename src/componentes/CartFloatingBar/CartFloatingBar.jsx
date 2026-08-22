import React from 'react';
import './CartFloatingBar.css';

export const CartFloatingBar = ({ totalItems = 0, totalPrice = 0, onOpenCart }) => {
  // Si no hay productos en el carrito, no renderizamos nada
  if (totalItems <= 0) return null;

  // Formatear el precio a formato moneda (ej. $ 4.900)
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <div className="cart-floating-bar-container">
      <div className="cart-floating-bar" onClick={onOpenCart} role="button" tabIndex={0}>
        <div className="cart-floating-info">
          <div className="cart-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cart-badge">{totalItems}</span>
          </div>

          <div className="cart-text-summary">
            <span className="cart-items-count">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
            <span className="cart-dot-separator">•</span>
            <span className="cart-total-price">Total: {formattedPrice}</span>
          </div>
        </div>

        <button className="cart-floating-btn" type="button" onClick={onOpenCart}>
          Ver Carrito
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartFloatingBar;