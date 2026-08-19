import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

export const SplashScreen = ({ duracion = 3500, onFinish }) => {
  const [desvanecer, setDesvanecer] = useState(false);
  const [ocultar, setOcultar] = useState(false);

  useEffect(() => {
    // 1. Inicia el efecto fade-out casi al final
    const timerFade = setTimeout(() => {
      setDesvanecer(true);
    }, duracion - 500);

    // 2. Remueve el componente por completo del DOM
    const timerOcultar = setTimeout(() => {
      setOcultar(true);
      onFinish?.();
    }, duracion);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerOcultar);
    };
  }, [duracion, onFinish]);

  if (ocultar) return null;

  return (
    <div id="splash" className={desvanecer ? 'fade-out' : ''}>
      <div className="logo-container">
        <svg className="logo-svg" viewBox="0 0 120 100">
          <defs>
            <mask id="cut">
              <rect width="100%" height="100%" fill="white" />
              {/* Flecha */}
              <path
                d="M45 65 L90 30 L80 25 L105 30 L85 50 Z"
                fill="black"
              />
            </mask>
          </defs>

          {/* M centrada */}
          <path
            id="mPath"
            d="M25 85 L25 15 L60 65 L95 15 L95 85"
            stroke="#0F172A"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            mask="url(#cut)"
          />
        </svg>

        <p className="brand">MarketGO</p>
      </div>
    </div>
  );
};