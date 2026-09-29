import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// Array extendido con clon al principio y clon al final: [Último, 1, 2, 3, Primero]
const EXTENDED_SLIDES = [
  { ...SLIDES[SLIDES.length - 1], id: 'clone-last' },
  ...SLIDES,
  { ...SLIDES[0], id: 'clone-first' }
];

export const Carrusel = () => {
  // Empezamos en el índice 1 porque el índice 0 ahora es el clon del último slide
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Manejar el salto invisible cuando llega a los extremos (clones)
  const handleTransitionEnd = () => {
    // Si llegó al clon del primer slide (al final del todo)
    if (currentIndex === EXTENDED_SLIDES.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1); // Salto instantáneo al slide real número 1
    }
    // Si llegó al clon del último slide (al principio del todo)
    else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(SLIDES.length); // Salto instantáneo al slide real número 3 (último)
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe hacia la izquierda (siguiente)
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      resetTimer();
    } else if (distance < -minSwipeDistance) {
      // Swipe hacia la derecha (anterior)
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      resetTimer();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Cálculo del índice real para los puntitos (dots) de 0 a SLIDES.length - 1
  const getActiveDotIndex = () => {
    if (currentIndex === 0) return SLIDES.length - 1;
    if (currentIndex === EXTENDED_SLIDES.length - 1) return 0;
    return currentIndex - 1;
  };

  return (
    <section id="carouselSection" className="carousel-wrapper">
      <div 
        className="carousel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="carousel-track" 
          onTransitionEnd={handleTransitionEnd}
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none' 
          }}
        >
          {EXTENDED_SLIDES.map((slide, index) => (
            <div key={`${slide.id}-${index}`} className={`slide hero-slide ${slide.slideClass}`}>
              <picture>
                <source media="(max-width: 768px)" srcSet={slide.mobileImg} />
                <img alt={slide.title} src={slide.desktopImg} />
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
            className={`dot ${getActiveDotIndex() === index ? 'active' : ''}`}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(index + 1); // +1 por el clon inicial
              resetTimer();
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Carrusel;