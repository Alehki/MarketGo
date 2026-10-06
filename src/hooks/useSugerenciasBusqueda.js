import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSugerenciasBusqueda(termino) {
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Si el término está vacío, limpiamos todo de inmediato
    if (!termino || termino.trim() === '') {
      setSugerencias([]);
      setCargando(false);
      return;
    }

    // 🟢 1. INSTANTÁNEO: Activamos la carga apenas el usuario tipea (0ms)
    setCargando(true);

    // 2. El Debounce: esperamos 300ms antes de ir a Supabase
    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('id, nombre')
          .ilike('nombre', `%${termino}%`)
          .limit(5);

        if (!error && data) {
          setSugerencias(data);
        }
      } catch (err) {
        console.error("Error al buscar sugerencias:", err);
      } finally {
        // 3. Apagamos la carga cuando la consulta termina
        setCargando(false);
      }
    }, 600);

    // Limpiamos el timeout si el usuario sigue tipeando antes de los 300ms
    return () => clearTimeout(timer);
  }, [termino]);

  return { sugerencias, cargando };
}