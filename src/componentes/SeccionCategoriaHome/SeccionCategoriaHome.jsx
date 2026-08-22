import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { 
  obtenerProductosPorCategoria, 
  obtenerProductosDestacados, 
  suscribirseAProductos 
} from '../../services/productosService';
import './SeccionCategoriaHome.css';

const removerAcentos = (texto) => {
  return (texto || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

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

      console.log(`[SeccionCategoriaHome] Categoria "${nombreCategoria || titulo}":`, datos);

      if (!cancelado) {
        setProductos(datos ? datos.slice(0, 6) : []);
        setCargando(false);
      }
    }

    fetchProductos();

    const canal = suscribirseAProductos((payload) => {
      const { eventType, new: nuevoProd, old: viejoProd } = payload;

      setProductos((prevProductos) => {
        const imgPrincipal = nuevoProd?.imagen_url || (Array.isArray(nuevoProd?.imagenes) ? nuevoProd.imagenes[0] : null);
        const prodNormalizado = nuevoProd ? {
          ...nuevoProd,
          imagen_url: imgPrincipal,
          imagenes: Array.isArray(nuevoProd.imagenes) ? nuevoProd.imagenes : [imgPrincipal]
        } : null;

        const catProd = removerAcentos(prodNormalizado?.categoria);
        const catBuscada = removerAcentos(nombreCategoria);

        const leCorrespondeAEstaSeccion = esDestacados 
          ? (prodNormalizado?.activo && prodNormalizado?.destacado)
          : (prodNormalizado?.activo && catProd === catBuscada);

        if (eventType === 'UPDATE') {
          if (leCorrespondeAEstaSeccion) {
            const existe = prevProductos.some(p => p.id === prodNormalizado.id);
            if (existe) {
              return prevProductos.map(p => p.id === prodNormalizado.id ? prodNormalizado : p);
            } else {
              return [...prevProductos, prodNormalizado].slice(0, 6);
            }
          } else {
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
          <p style={{ padding: '1rem', fontSize: '0.9rem' }}>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p style={{ padding: '1rem', fontSize: '0.9rem', color: '#888' }}>
            No hay productos disponibles en esta categoría.
          </p>
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