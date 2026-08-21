import React, { useState, useEffect } from 'react';
import { CartButton } from '../Header/CartButton/CartButton'; // Ajustá la ruta según tu proyecto
import './BuscadorDesplegable.css';

export const BuscadorDesplegable = ({
  isOpen,
  onClose,
  cantidadCarrito = 0,
  onAbrirCarrito,
  onSearch
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

  if (!isOpen) return null;

  const handleEjecutarBusqueda = (texto) => {
    if (!texto.trim()) return;

    const nuevoHistorial = [texto, ...historial.filter(item => item !== texto)].slice(0, 5);
    setHistorial(nuevoHistorial);
    localStorage.setItem('historial_busquedas', JSON.stringify(nuevoHistorial));

    if (onSearch) onSearch(texto);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEjecutarBusqueda(query);
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
      {/* Header superior coherente con la App */}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <svg className="icon-lupa" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="7" />
            <line x1="20" y1="20" x2="16.5" y2="16.5" />
          </svg>
        </div>

        {/* Tu componente oficial de Carrito */}
        <CartButton cantidad={cantidadCarrito} onClick={onAbrirCarrito} />
      </div>

      {/* Historial de búsquedas */}
      <div className="buscador-body">
        {historial.length > 0 && (
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
      </div>
    </div>
  );
};