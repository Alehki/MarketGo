import React, { useState, useEffect, useRef } from "react";
import "./CartButton.css";

export function CartButton({ cantidad = 0, onClick }) {
  const estaVacio = cantidad === 0;
  
  // Guardamos el tipo de animación activa: 'sumar', 'restar' o null
  const [animacion, setAnimacion] = useState(null);
  const cantidadAnterior = useRef(cantidad);

  useEffect(() => {
    const prev = cantidadAnterior.current;

    if (cantidad > prev) {
      setAnimacion('sumar'); // Al agregar/sumar
    } else if (cantidad < prev) {
      setAnimacion('restar'); // Al quitar/restar
    }

    cantidadAnterior.current = cantidad;
  }, [cantidad]);

  return (
    <button 
      className={`carrito-btn ${estaVacio ? "deshabilitado" : ""}`}
      onClick={estaVacio ? undefined : onClick}
      disabled={estaVacio}
      aria-label="Carrito de compras"
    >
      <svg
        className="icon-cart"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M3 3h2l2.5 12h11l2-8H7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="10"
          cy="20"
          r="1.5"
          fill="currentColor"
        />

        <circle
          cx="18"
          cy="20"
          r="1.5"
          fill="currentColor"
        />
      </svg>

      <span 
        className={`cart-count ${animacion ? `anim-${animacion}` : ""}`}
        onAnimationEnd={() => setAnimacion(null)}
      >
        {cantidad}
      </span>
    </button>
  );
}