import React from 'react';
import { BannerPromoCard } from './BannerPromoCard';
import './SeccionBanners.css';

export const SeccionBanners = ({ banners = [], onSeleccionarBanner }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="seccion-banners-carrusel">
      {banners.map((banner) => (
        <BannerPromoCard
          key={banner.id}
          imagen={banner.imagen}
          titulo={banner.titulo}
          subtitulo={banner.subtitulo}
          colorFondo={banner.colorFondo}
          onClick={() => onSeleccionarBanner && onSeleccionarBanner(banner)}
        />
      ))}
    </div>
  );
};