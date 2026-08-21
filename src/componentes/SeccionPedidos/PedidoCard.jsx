import React, { useState, useEffect, useRef } from 'react';
import { DetallePedidoModal } from './DetallePedidoModal'; // 👈 Importamos el componente
import './PedidoCard.css';

const PASOS_PEDIDO = ["recibido", "preparando", "en_camino", "entregado"];

const MAPA_ESTADOS = {
  recibido: "Recibido",
  pendiente: "Recibido",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado"
};

const formatearEstado = (estado) => MAPA_ESTADOS[estado] || "Recibido";

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return "";

  return fecha.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const PedidoCard = ({ pedido = {}, esHistorial = false, onMarcarFinalizado }) => {
  const [saliendo, setSaliendo] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const onMarcarFinalizadoRef = useRef(onMarcarFinalizado);
  const pedidoIdRef = useRef(pedido?.id);

  useEffect(() => {
    onMarcarFinalizadoRef.current = onMarcarFinalizado;
    pedidoIdRef.current = pedido?.id;
  }, [onMarcarFinalizado, pedido?.id]);

  const estadoNormalizado = (!pedido?.estado || pedido.estado === "pendiente")
    ? "recibido" 
    : pedido.estado;

  const indexEncontrado = PASOS_PEDIDO.indexOf(estadoNormalizado);
  const actualIndex = indexEncontrado !== -1 ? indexEncontrado : 0;
  const progreso = actualIndex / (PASOS_PEDIDO.length - 1);

  useEffect(() => {
    if (estadoNormalizado === "entregado" && !esHistorial) {
      const timerSalida = setTimeout(() => {
        setSaliendo(true);
      }, 2000);

      const timerFinalizar = setTimeout(() => {
        if (onMarcarFinalizadoRef.current && pedidoIdRef.current) {
          onMarcarFinalizadoRef.current(pedidoIdRef.current);
        }
      }, 2450);

      return () => {
        clearTimeout(timerSalida);
        clearTimeout(timerFinalizar);
      };
    }
  }, [estadoNormalizado, esHistorial]);

  return (
    <>
      <div
        className={`pedido-card estado-${estadoNormalizado} ${saliendo ? 'saliendo' : ''} ${
          !esHistorial ? 'apareciendo' : ''
        }`}
        data-estado-final={estadoNormalizado}
      >
        <div className="pedido-header">
          <span className="pedido-id">
            Pedido #{String(pedido?.id || '').slice(0, 8)}
          </span>
          <span className="pedido-estado">
            {formatearEstado(estadoNormalizado)}
          </span>
        </div>

        <div className="pedido-body">
          <p className="pedido-total">
            Total: ${pedido?.total?.toLocaleString('es-AR') || '0'}
          </p>
          <p className="fecha">{formatearFecha(pedido?.created_at)}</p>

          <div
            className="pedido-progreso"
            style={{ '--progreso': progreso }}
            role="progressbar"
            aria-valuenow={actualIndex + 1}
            aria-valuemin={1}
            aria-valuemax={PASOS_PEDIDO.length}
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
                  <div className="circulo" aria-hidden="true">
                    {esCompletado ? "✓" : ""}
                  </div>
                  <span>{MAPA_ESTADOS[paso]}</span>
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
            onClick={() => setMostrarModal(true)}
          >
            Ver detalle
            <span className="flecha-btn">→</span>
          </button>
        </div>
      </div>

      {/* Uso del nuevo componente modal */}
      {mostrarModal && (
        <DetallePedidoModal
          pedido={pedido}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </>
  );
};