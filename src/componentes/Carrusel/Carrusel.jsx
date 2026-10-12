import React, { useEffect, useCallback, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { getCarouselSlides } from '../../services/carruselService';
import './Carrusel.css';

export const Carrusel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const timerRef = useRef(null);

  // Carga inicial de Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      const data = await getCarouselSlides();
      setSlides(data);
      setLoading(false);
    };

    fetchSlides();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!emblaApi) return;
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);
  }, [emblaApi]);

  // Sincronización con Embla cuando llegan los slides
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('pointerDown', resetTimer);

    resetTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (emblaApi) {
        emblaApi.off('pointerDown', resetTimer);
      }
    };
  }, [emblaApi, onSelect, resetTimer, slides]);

  const handleDotClick = (index) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
    resetTimer();
  };

  if (loading) {
    return (
      <section id="carouselSection" className="carousel-wrapper">
        <div 
          className="carousel-container" 
          style={{ height: '160px', backgroundColor: '#FFD600' }} 
        />
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section id="carouselSection" className="carousel-wrapper">
      <div className="carousel-container" ref={emblaRef}>
        <div className="carousel-track">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;

            return (
              <div
                key={slide.id}
                className={`slide hero-slide slide-${slide.id} ${isActive ? 'is-active' : ''}`}
              >
                <div className="slide-inner">
                  {/* Contenido / Texto */}
                  <div className="slide-content">
                    {slide.badge && <span className="badge">{slide.badge}</span>}
                    <h3>{slide.title}</h3>
                    {slide.subtitle && <p>{slide.subtitle}</p>}
                  </div>

                  {/* Imagen */}
                  <div className="slide-image-container">
                    <picture>
                      {slide.mobile_img_url && (
                        <source media="(max-width: 768px)" srcSet={slide.mobile_img_url} />
                      )}
                      <img
                        src={slide.desktop_img_url}
                        alt={slide.title}
                        className="slide-product-img"
                      />
                    </picture>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicadores (Dots) */}
      <div className="dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === selectedIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Carrusel;