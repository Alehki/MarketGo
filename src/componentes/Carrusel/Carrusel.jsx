import React, { useState, useEffect } from 'react';
import './Carrusel.css';

const BASE = import.meta.env.BASE_URL;

const SLIDES = [
  {
    id: 1,
    mobileImg: `${BASE}assets/Carrusel/principal.webp`,
    desktopImg: `${BASE}assets/Carrusel/banner3-desktop.webp`,
    title: 'Recibí tu pedido en 10–25 min',
    subtitle: 'En Hurlingham, Morris y Villa Tesei',
    contentClass: 'slide-content-1',
    slideClass: '',
  },
  {
    id: 2,
    mobileImg: `${BASE}assets/Carrusel/principal2.webp`,
    desktopImg: `${BASE}assets/Carrusel/principal2.webp`,
    badge: 'Primera compra',
    title: 'Envío gratis',
    subtitle: '+ peluche de regalo',
    contentClass: 'slide-content-2',
    slideClass: '',
  },
  {
    id: 3,
    mobileImg: `${BASE}assets/Carrusel/principal3.webp`,
    desktopImg: `${BASE}assets/Carrusel/principal3.webp`,
    title: 'Estamos cerca tuyo',
    subtitle: 'Hurlingham, Morris y Villa Tesei',
    contentClass: 'slide-content-3',
    slideClass: 'slide-3',
  },
];

export const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático cada 4 segundos (4000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="carouselSection" className="carousel-wrapper">
      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div key={slide.id} className={`slide hero-slide ${slide.slideClass}`}>
              <picture>
                <source srcSet={slide.mobileImg} media="(max-width: 768px)" />
                <img src={slide.desktopImg} alt={slide.title} />
              </picture>

              <div className={`slide-content ${slide.contentClass}`}>
                {slide.badge && <span className="badge">{slide.badge}</span>}
                <h3>{slide.title}</h3>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Puntos indicadores (Dots) */}
      <div className="dots">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};