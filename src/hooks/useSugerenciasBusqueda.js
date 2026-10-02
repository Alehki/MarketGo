import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // tu cliente de supabase

export function useSugerenciasBusqueda(termino) {
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Si el término está vacío, limpiamos sugerencias
    if (!termino || termino.trim() === '') {
      setSugerencias([]);
      return;
    }

    // El Debounce: esperamos 300ms antes de ir a Supabase
    const timer = setTimeout(async () => {
      setCargando(true);
      try {
        // Consulta exacta a Supabase buscando coincidencias parciales
        const { data, error } = await supabase
          .from('productos')
          .select('id, nombre')
          .ilike('nombre', `%${termino}%`)
          .limit(5); // Traemos solo las primeras 5 sugerencias para no ensanchar el desplegable

        if (!error && data) {
          setSugerencias(data);
        }
      } catch (err) {
        console.error("Error al buscar sugerencias:", err);
      } finally {
        setCargando(false);
      }
    }, 300);

    // Limpiamos el timeout si el usuario sigue tipeando antes de los 300ms
    return () => clearTimeout(timer);
  }, [termino]);

  return { sugerencias, cargando };
}