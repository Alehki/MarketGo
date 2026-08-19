import { useState, useEffect } from 'react';
import { obtenerProductosDestacados } from '../services/productosService.js';

export function useProductosDestacados() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchDestacados() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const data = await obtenerProductosDestacados();
        setProducts(data || []);
      } catch (error) {
        setErrorMsg('No se pudieron cargar los productos destacados.');
      } finally {
        setLoading(false);
      }
    }

    fetchDestacados();
  }, []);

  return { products, loading, errorMsg };
}