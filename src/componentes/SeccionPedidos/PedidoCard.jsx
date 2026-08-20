import React, { useState, useEffect } from 'react';
import './PedidoCard.css';

const PASOS_PEDIDO = ["recibido", "preparando", "en_camino", "entregado"];

const LABELS_ESTADO = {
  recibido: "Recibido",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado"
};

const formatearEstado = (estado) => {
  const estados = {
    recibido: "Recibido",
    pendiente: "Recibido", // <-- Aseguramos que si dice "pendiente" muestre "Recibido"
    preparando: "Preparando",
    en_camino: "En camino",
    entregado: "Entregado"
  };
  return estados[estado] || "Recibido";
};

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  const offset = fecha.getTimezoneOffset();
  const fechaLocal = new Date(fecha.getTime() - offset * 60000);

  return (
    fechaLocal.toLocaleDateString("es-AR") +
    " " +
    fechaLocal.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );
};

export const PedidoCard = ({ pedido, esHistorial, onMarcarFinalizado }) => {
  const [saliendo, setSaliendo] = useState(false);

  // 1. SI EL ESTADO VIENE NULO, PENDIENTE O VACÍO, USAMOS 'recibido' COMO BASE
  const estadoNormalizado = (pedido.estado === "pendiente" || !pedido.estado) 
    ? "recibido" 
    : pedido.estado;

  // 2. Calculamos el índice con el estado normalizado
  const indexEncontrado = PASOS_PEDIDO.indexOf(estadoNormalizado);
  const actualIndex = indexEncontrado !== -1 ? indexEncontrado : 0;
  
  const progreso = actualIndex / (PASOS_PEDIDO.length - 1);

  useEffect(() => {
    if (estadoNormalizado === "entregado" && !esHistorial) {
      const timerSalida = setTimeout(() => {
        setSaliendo(true);
      }, 1000);

      const timerFinalizar = setTimeout(() => {
        if (onMarcarFinalizado) {
          onMarcarFinalizado(pedido.id);
        }
      }, 1450);

      return () => {
        clearTimeout(timerSalida);
        clearTimeout(timerFinalizar);
      };
    }
  }, [estadoNormalizado, esHistorial, pedido.id, onMarcarFinalizado]);

  return (
    <div
      /* Usamos estadoNormalizado para asegurar que siempre tome la clase CSS correcta como .estado-recibido */
      className={`pedido-card estado-${estadoNormalizado} ${saliendo ? 'saliendo' : ''} ${
        !esHistorial ? 'apareciendo' : ''
      }`}
      data-estado-final={estadoNormalizado}
    >
      <div className="pedido-header">
        <span className="pedido-id">
          Pedido #{String(pedido.id).slice(0, 8)}
        </span>
        <span className="pedido-estado">
          {formatearEstado(estadoNormalizado)}
        </span>
      </div>

      <div className="pedido-body">
        <p style={{ fontWeight: 'bold', margin: '8px 0 4px 0' }}>Total: ${pedido.total}</p>
        <p className="fecha">{formatearFecha(pedido.created_at)}</p>

        {/* Barra de Progreso */}
        <div
          className="pedido-progreso"
          style={{ '--progreso': progreso }}
        >
          {PASOS_PEDIDO.map((paso, index) => {
            const esCompletado = index < actualIndex;
            const esActivo = index === actualIndex;

            const clasesPaso = ['paso'];
            if (esCompletado) clasesPaso.push('completado');
            if (esActivo) {
              clasesPaso.push('activo');
              if (estadoNormalizado === 'entregado') clasesPaso.push('finalizado');
            }

            return (
              <div key={paso} className={clasesPaso.join(' ')}>
                <div className="circulo">{esCompletado ? "✓" : ""}</div>
                <span>{LABELS_ESTADO[paso]}</span>
              </div>
            );
          })}
        </div>

        {estadoNormalizado !== "entregado" && (
          <div className="pedido-eta">
            🕒 Llegada estimada: 15-25 min
          </div>
        )}
      </div>

      <div className="pedido-footer">
        <button
          className="btn-detalle"
          type="button"
          onClick={() => console.log('Ver detalle del pedido', pedido.id)}
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
};