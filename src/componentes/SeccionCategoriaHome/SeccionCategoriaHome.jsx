import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { 
  obtenerProductosPorCategoria, 
  obtenerProductosDestacados, 
  suscribirseAProductos 
} from '../../services/productosService';
import './SeccionCategoriaHome.css';

// Helper local para dar formato correcto a arrays al recibir datos crudos de Realtime
function normalizarProducto(p) {
  if (!p) return p;
  return {
    ...p,
    imagenes: Array.isArray(p.imagenes) ? p.imagenes : (p.imagenes ? [p.imagenes] : []),
    colores: Array.isArray(p.colores) ? p.colores : (p.colores ? [p.colores] : [])
  };
}

export const SeccionCategoriaHome = ({ 
  titulo, 
  nombreCategoria, 
  esDestacados = false, 
  onMostrarTodos,
  carrito = {},
  onAgregar,
  onRestar,
  onEliminar,
  onAbrirProducto
}) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function fetchProductos() {
      setCargando(true);
      let datos = [];

      if (esDestacados) {
        datos = await obtenerProductosDestacados();
      } else if (nombreCategoria) {
        datos = await obtenerProductosPorCategoria(nombreCategoria);
      }

      if (!cancelado) {
        setProductos(datos ? datos.slice(0, 6) : []);
        setCargando(false);
      }
    }

    fetchProductos();

    // Escuchar el evento payload en vivo para modificar la lista en memoria sin re-cargar la API
    const canal = suscribirseAProductos((payload) => {
      const { eventType, new: nuevoProd, old: viejoProd } = payload;

      setProductos((prevProductos) => {
        const prodNormalizado = normalizarProducto(nuevoProd);

        // Evaluar si al producto le corresponde estar en esta sección
        const leCorrespondeAEstaSeccion = esDestacados 
          ? (prodNormalizado?.activo && prodNormalizado?.destacado)
          : (prodNormalizado?.activo && prodNormalizado?.categoria === nombreCategoria);

        if (eventType === 'UPDATE') {
          if (leCorrespondeAEstaSeccion) {
            const existe = prevProductos.some(p => p.id === prodNormalizado.id);
            if (existe) {
              return prevProductos.map(p => p.id === prodNormalizado.id ? prodNormalizado : p);
            } else {
              return [...prevProductos, prodNormalizado].slice(0, 6);
            }
          } else {
            // Si el producto se desactivó o cambió de categoría, lo removemos limpiamente
            return prevProductos.filter(p => p.id !== prodNormalizado.id);
          }
        }

        if (eventType === 'DELETE') {
          return prevProductos.filter(p => p.id !== viejoProd.id);
        }

        if (eventType === 'INSERT' && leCorrespondeAEstaSeccion) {
          return [...prevProductos, prodNormalizado].slice(0, 6);
        }

        return prevProductos;
      });
    });

    return () => {
      cancelado = true;
      if (canal) canal.unsubscribe();
    };
  }, [nombreCategoria, esDestacados]);

  if (!cargando && productos.length === 0) return null;

  const handleClickMostrarTodos = () => {
    if (onMostrarTodos) {
      onMostrarTodos({ nombre: nombreCategoria || titulo });
    }
  };

  return (
    <section className="seccion-categoria-home">
      <div className="seccion-header">
        <h2 className="seccion-titulo">{titulo}</h2>
        {onMostrarTodos && (
          <button className="btn-mostrar-todos" onClick={handleClickMostrarTodos}>
            Mostrar todos
          </button>
        )}
      </div>

      <div className="carrusel-horizontal-productos">
        {cargando ? (
          <p style={{ padding: '1rem', fontSize: '0.9rem' }}>Cargando...</p>
        ) : (
          productos.map((prod) => (
            <div key={prod.id} className="item-carrusel-producto">
              <ProductoCard
                producto={prod}
                cantidad={carrito[prod.id]?.cantidad || 0}
                onAgregar={() => onAgregar(prod)}
                onRestar={() => onRestar(prod.id)}
                onEliminar={() => onEliminar(prod.id)}
                onAbrir={() => onAbrirProducto(prod.id, prod)}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};