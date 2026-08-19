import { useState, useEffect } from "react";
import { obtenerProductos, obtenerListas } from "../services/productosService";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [listas, setListas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        // Podemos traer ambos en paralelo si los necesitas
        const [prodsData, listasData] = await Promise.all([
          obtenerProductos(),
          obtenerListas()
        ]);

        setProductos(prodsData);
        setListas(listasData);
      } catch (err) {
        setError("Ocurrió un error al cargar los productos");
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  return { productos, listas, cargando, error };
}