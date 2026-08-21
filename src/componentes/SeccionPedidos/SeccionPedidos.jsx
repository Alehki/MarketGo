import React, { useState, useEffect } from 'react';
import { obtenerPedidosCliente, suscribirseAPedidos } from '../../services/pedidosServices.js';
import { PedidoCard } from './PedidoCard';
import "./SeccionPedidos.css";

export const SeccionPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidosFinalizados, setPedidosFinalizados] = useState({});
  const [pestanaActiva, setPestanaActiva] = useState('activos');

  const cargarPedidos = async () => {
    const datos = await obtenerPedidosCliente();
    
    setPedidosFinalizados(prev => {
      const iniciales = { ...prev };
      datos.forEach(p => {
        if (p.estado === 'entregado' && iniciales[p.id] === undefined) {
          iniciales[p.id] = false;
        }
      });
      return iniciales;
    });

    setPedidos(datos);
    setCargando(false);
  };

  useEffect(() => {
    cargarPedidos();

    const canal = suscribirseAPedidos(() => {
      cargarPedidos();
    });

    return () => {
      if (canal) canal.unsubscribe();
    };
  }, []);

  const handleMarcarFinalizado = (pedidoId) => {
    setPedidosFinalizados(prev => ({ ...prev, [pedidoId]: true }));
  };

  const ordenados = [...pedidos].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const activos = ordenados.filter(p => {
    if (p.estado !== "entregado") return true;
    return pedidosFinalizados[p.id] !== true;
  });

  const historial = ordenados.filter(p => {
    return p.estado === "entregado" && pedidosFinalizados[p.id] === true;
  });

  if (cargando) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando tus pedidos...</p>
      </div>
    );
  }

  if (!pedidos.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No tenés pedidos todavía</p>
      </div>
    );
  }

  return (
    <div className="seccion-pedidos-container">
      {/* Selector de pestañas */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${pestanaActiva === 'activos' ? 'activo' : ''}`}
          type="button"
          onClick={() => setPestanaActiva('activos')}
        >
          Activos ({activos.length})
        </button>
        <button
          className={`tab-btn ${pestanaActiva === 'historial' ? 'activo' : ''}`}
          type="button"
          onClick={() => setPestanaActiva('historial')}
        >
          Historial ({historial.length})
        </button>
      </div>

      {/* Contenido envuelto en un contenedor de pestañas */}
      <div className="tabs-contenido-wrapper">
        <div className={`pedidos-seccion activos ${pestanaActiva === 'activos' ? 'panel-visible' : 'panel-oculto'}`}>
          {activos.length === 0 ? (
            <p className="sin-pedidos-msj">No tenés pedidos activos en este momento.</p>
          ) : (
            activos.map(pedido => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                esHistorial={false}
                onMarcarFinalizado={handleMarcarFinalizado}
              />
            ))
          )}
        </div>

        <div className={`pedidos-seccion historial ${pestanaActiva === 'historial' ? 'panel-visible' : 'panel-oculto'}`}>
          {historial.length === 0 ? (
            <p className="sin-pedidos-msj">Todavía no tenés historial de pedidos.</p>
          ) : (
            historial.map(pedido => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                esHistorial={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};