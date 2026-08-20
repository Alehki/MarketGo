import { useState, useEffect } from 'react';
import { obtenerCategorias, suscribirseAProductos } from '../services/productosService.js';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategorias() {
    try {
      const data = await obtenerCategorias();
      setCategorias(data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategorias();

    // Escuchar actualizaciones en tiempo real cuando el Admin modifica productos
    const canal = suscribirseAProductos(() => {
      fetchCategorias();
    });

    return () => {
      if (canal) canal.unsubscribe();
    };
  }, []);

  return { categorias, loading };
}

