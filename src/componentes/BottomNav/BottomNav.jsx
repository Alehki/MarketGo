import React from 'react';
import './BottomNav.css';

export const BottomNav = ({ tabActiva, setTabActiva }) => {
  return (
    <nav className="bottom-nav" id="bottomNav">
      <button 
        className={`nav-item ${tabActiva === 'inicio' ? 'active' : ''}`}
        onClick={() => setTabActiva('inicio')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 10L12 3L21 10V20H3V10Z" strokeWidth="2"/>
        </svg>
        <small>Inicio</small>
      </button>

      <button 
        className={`nav-item ${tabActiva === 'pedidos' ? 'active' : ''}`}
        onClick={() => setTabActiva('pedidos')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 7H21V20H3V7Z" strokeWidth="2"/>
          <path d="M16 3V7M8 3V7" strokeWidth="2"/>
        </svg>
        <small>Pedidos</small>
      </button>

      <button 
        className={`nav-item ${tabActiva === 'perfil' ? 'active' : ''}`}
        onClick={() => setTabActiva('perfil')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="8" r="4" strokeWidth="2"/>
          <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" strokeWidth="2"/>
        </svg>
        <small>Perfil</small>
      </button>
    </nav>
  );
};