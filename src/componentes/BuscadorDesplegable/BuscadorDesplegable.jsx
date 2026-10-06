import React, { useState, useEffect } from 'react';
import { CartButton } from '../Header/CartButton/CartButton'; // Ajustá la ruta según tu proyecto
import { SkeletonItem } from '../skeletons/SkeletonItem/SkeletonItem'; 
import './BuscadorDesplegable.css';

export const BuscadorDesplegable = ({
  isOpen,
  onClose,
  cantidadCarrito = 0,
  onAbrirCarrito,
  onSearch,
  terminoEscrito,      
  onTerminoChange,      
  sugerencias = [],     
  cargandoSugerencias,  
  onSelectSugerencia
}) => {
  const [query, setQuery] = useState('');
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('historial_busquedas')) || [
      'Mostaza',
      'Sugus max',
      'Los pinos'
    ];
    setHistorial(guardados);
  }, []);

  //  Efecto para cerrar el buscador con el botón "Atrás" del celular o navegador
  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Agregamos una entrada al historial del navegador cuando se abre
      window.history.pushState({ buscadorAbierto: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  // 

  if (!isOpen) return null;

  const handleEjecutarBusqueda = (texto) => {
    if (!texto.trim()) return;

    const nuevoHistorial = [texto, ...historial.filter(item => item !== texto)].slice(0, 5);
    setHistorial(nuevoHistorial);
    localStorage.setItem('historial_busquedas', JSON.stringify(nuevoHistorial));

    if (onSearch) onSearch(texto);

    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEjecutarBusqueda(terminoEscrito);
    }
  };

  const eliminarDelHistorial = (e, itemEliminar) => {
    e.stopPropagation();
    const actualizado = historial.filter(item => item !== itemEliminar);
    setHistorial(actualizado);
    localStorage.setItem('historial_busquedas', JSON.stringify(actualizado));
  };

  return (
    <div className="overlay-buscador">
      {/* Header superior */}
      <div className="buscador-header-top">
        <button type="button" className="btn-flecha-atras" onClick={onClose} aria-label="Volver">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div className="input-busqueda-wrapper">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={terminoEscrito}                               /* 🟢 Usamos el estado global */
            onChange={(e) => onTerminoChange(e.target.value)}    /* 🟢 Actualizamos App.jsx */
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <svg className="icon-lupa" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="7" />
            <line x1="20" y1="20" x2="16.5" y2="16.5" />
          </svg>
        </div>

        <CartButton cantidad={cantidadCarrito} onClick={onAbrirCarrito} />
      </div>

      {/* Cuerpo dinámico: Historial vs Sugerencias */}
      <div className="buscador-body">
        
        {!terminoEscrito && historial.length > 0 && (
          <div className="seccion-historial">
            <h3>Tus últimas búsquedas</h3>
            <div className="lista-historial">
              {historial.map((item, index) => (
                <div
                  key={index}
                  className="item-historial"
                  onClick={() => handleEjecutarBusqueda(item)}
                >
                  <div className="item-historial-left">
                    <div className="icon-box">
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="#64748b" strokeWidth="2" fill="none">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="20" y1="20" x2="16.5" y2="16.5" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={(e) => eliminarDelHistorial(e, item)}
                    aria-label="Eliminar del historial"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASO 2: Si está escribiendo, mostramos las sugerencias de Supabase */}
        {terminoEscrito && (
          <div className="seccion-sugerencias">
            
            {/* 🟢 1. Si está cargando, mostramos los esqueletos */}
            {cargandoSugerencias && (
              <div className="lista-sugerencias">
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
              </div>
            )}

            {/* 🟢 2. Si terminó de cargar y NO hay resultados, mostramos el mensaje */}
            {!cargandoSugerencias && sugerencias.length === 0 && (
              <p className="sugerencia-estado">No se encontraron productos sugeridos.</p>
            )}

            {/* 🟢 3. Si terminó de cargar y SÍ hay resultados, mostramos la lista */}
            {!cargandoSugerencias && sugerencias.length > 0 && (
              <div className="lista-sugerencias">
                {sugerencias.map((prod) => (
                  <div
                    key={prod.id}
                    className="item-sugerencia"
                    onClick={() => {
                      if (onSelectSugerencia) onSelectSugerencia(prod.nombre);
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="#9ca3af" strokeWidth="2" fill="none">
                      <circle cx="11" cy="11" r="7" />
                      <line x1="20" y1="20" x2="16.5" y2="16.5" />
                    </svg>
                    <span>{prod.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};