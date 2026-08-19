import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { obtenerProductosPorCategoria, obtenerProductosDestacados } from '../../services/productosService';
import './SeccionCategoriaHome.css';

export const SeccionCategoriaHome = ({ 
  titulo, 
  nombreCategoria, // Ejemplo: "Bebidas", "Lácteos" o "Los más vendidos"
  esDestacados = false, // Si es true, usa obtenerProductosDestacados()
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
        // Tomamos solo los primeros 6 para el carrusel horizontal del home
        setProductos(datos ? datos.slice(0, 6) : []);
        setCargando(false);
      }
    }

    fetchProductos();

    // Limpieza para evitar fugas de memoria y renders desfasados
    return () => {
      cancelado = true;
    };
  }, [nombreCategoria, esDestacados]); // 🔴 Solo depende de tipos primitivos (strings/booleans)

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