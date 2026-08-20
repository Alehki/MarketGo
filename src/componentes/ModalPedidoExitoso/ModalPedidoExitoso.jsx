import React, { useEffect } from 'react';
import './ModalPedidoExitoso.css';
import sonidoExito from '../../../public/sounds/pedido-exitoso.mp3';

export const ModalPedidoExitoso = ({ ordenId, onCerrar }) => {
  useEffect(() => {
    // Reproduce el sonido al mostrar el modal
    const audio = new Audio(sonidoExito); // Asegurate de que el archivo esté en public/sounds/
    audio.volume = 0.6; // Ajustá el volumen de 0.0 a 1.0 según prefieras

    audio.play().catch((error) => {
      console.warn("Autoplay bloqueado por el navegador:", error);
    });
  }, []);

  return (
    <div className="overlay-animacion">
      <div className="card-exito">
        
        {/* SVG Animado con CSS puro */}
        <div className="contenedor-icono">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <h2 className="titulo-exito">¡Pedido Confirmado!</h2>
        <p className="subtitulo-exito">
          Tu pedido {ordenId ? `#${ordenId}` : ''} ya fue recibido y lo estamos preparando.
        </p>

        <button className="btn-continuar" onClick={onCerrar}>
          Seguir viendo la app
        </button>
      </div>
    </div>
  );
};