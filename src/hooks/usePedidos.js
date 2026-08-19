import { useState, useEffect } from "react";
import { obtenerPedidosCliente, suscribirseAPedidos } from "../services/pedidosService";

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarPedidos = async () => {
    const data = await obtenerPedidosCliente();
    setPedidos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarPedidos();

    // Conexión Realtime
    const channel = suscribirseAPedidos(() => {
      cargarPedidos(); // Recarga la lista automáticamente cuando hay cambios
    });

    // Clean-up al desmontar el componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { pedidos, cargando, recargar: cargarPedidos };
}