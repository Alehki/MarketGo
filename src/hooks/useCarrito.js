import { useState, useEffect } from 'react';

export function crearKey(id, color = null) {
  return color ? `${id}_${color}` : id;
}

export function useCarrito(COMPRA_MINIMA = 0) {
  // Carga inicial persistente con localStorage
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito_app');
      return guardado ? JSON.parse(guardado) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('carrito_app', JSON.stringify(carrito));
  }, [carrito]);

  // Agregar item
  const agregarItem = (producto, color = null, cantidad = 1) => {
    setCarrito((prev) => {
      const key = crearKey(producto.id, color);
      const copia = { ...prev };

      if (!copia[key]) {
        copia[key] = {
          ...producto,
          color,
          cantidad: 0
        };
      }

      copia[key] = {
        ...copia[key],
        cantidad: copia[key].cantidad + cantidad
      };

      return copia;
    });
  };

  // Restar item (si pasa de 1 a 0 la UI se encarga de llamar a pedirEliminar)
  const restarItem = (key, cantidad = 1) => {
    setCarrito((prev) => {
      if (!prev[key]) return prev;

      const nuevaCantidad = prev[key].cantidad - cantidad;
      const copia = { ...prev };

      if (nuevaCantidad <= 0) {
        delete copia[key];
      } else {
        copia[key] = {
          ...copia[key],
          cantidad: nuevaCantidad
        };
      }

      return copia;
    });
  };

  // Eliminar item completamente por su Key
  const eliminarItem = (key) => {
    setCarrito((prev) => {
      const copia = { ...prev };
      delete copia[key];
      return copia;
    });
  };

  // Cálculos de Totales
  const total = Object.values(carrito).reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const cantidadTotalItems = Object.values(carrito).reduce(
    (acc, p) => acc + p.cantidad,
    0
  );

  const faltaParaMinimo = COMPRA_MINIMA - total;
  const cumpleMinimo = total >= COMPRA_MINIMA;

  return {
    carrito,
    agregarItem,
    restarItem,
    eliminarItem,
    total,
    cantidadTotalItems,
    faltaParaMinimo,
    cumpleMinimo
  };
}