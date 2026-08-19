import { useState, useEffect } from 'react';
import { obtenerCategorias } from '../services/productosService.js';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        setLoading(true);
        const data = await obtenerCategorias();
        setCategorias(data || []);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorias();
  }, []);

  return { categorias, loading };
}