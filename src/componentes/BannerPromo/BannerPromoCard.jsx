import React from 'react';
import './BannerPromoCard.css';

export const BannerPromoCard = ({ 
  imagen,           // URL de la imagen del banner completo
  titulo,           // Opcional: si armás la tarjeta con HTML/CSS puro
  subtitulo,        // Opcional
  colorFondo = '#4f46e5', // Fondo por defecto si no es imagen completa
  onClick 
}) => {
  return (
    <div 
      className="banner-promo-card" 
      onClick={onClick}
      style={{ backgroundColor: colorFondo }}
    >
      {/* Opción A: Si es un banner gráfico listo (como el de Nestlé de la foto) */}
      {imagen ? (
        <img src={imagen} alt={titulo || "Promoción"} className="banner-promo-img" />
      ) : (
        /* Opción B: Si querés renderizar texto y diseño con CSS */
        <div className="banner-promo-content">
          <div className="banner-promo-textos">
            {subtitulo && <span className="banner-promo-tag">{subtitulo}</span>}
            {titulo && <h3 className="banner-promo-titulo">{titulo}</h3>}
          </div>
        </div>
      )}
    </div>
  );
};