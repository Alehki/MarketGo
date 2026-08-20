import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { 
  obtenerProductosPorCategoria, 
  obtenerProductosDestacados, 
  suscribirseAProductos 
} from '../../services/productosService';
import './VistaCategoria.css';

// Helper local para normalizar los datos de Realtime
function normalizarProducto(p) {
  if (!p) return p;
  return {
    ...p,
    imagenes: Array.isArray(p.imagenes) ? p.imagenes : (p.imagenes ? [p.imagenes] : []),
    colores: Array.isArray(p.colores) ? p.colores : (p.colores ? [p.colores] : [])
  };
}

export const VistaCategoria = ({ 
  categoria, 
  onVolver, 
  carrito = {}, 
  onAgregar, 
  onRestar, 
  onEliminar,
  onAbrirProducto 
}) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const nombreCat = typeof categoria === 'string' ? categoria : categoria?.nombre;
  const esSeccionDestacados = nombreCat === "Los más vendidos" || nombreCat === "Destacados";

  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      if (!nombreCat) return;
      setCargando(true);
      
      let datos = [];

      if (esSeccionDestacados) {
        datos = await obtenerProductosDestacados();
      } else {
        datos = await obtenerProductosPorCategoria(nombreCat);
      }
      
      if (!cancelado) {
        setProductos(datos || []);
        setCargando(false);
      }
    }

    cargarProductos();

    // Actualización quirúrgica en tiempo real desde el payload
    const canal = suscribirseAProductos((payload) => {
      const { eventType, new: nuevoProd, old: viejoProd } = payload;

      setProductos((prevProductos) => {
        const prodNormalizado = normalizarProducto(nuevoProd);

        // Verificamos si al producto le corresponde estar en esta vista
        const leCorrespondeAEstaVista = esSeccionDestacados
          ? (prodNormalizado?.activo && prodNormalizado?.destacado)
          : (prodNormalizado?.activo && prodNormalizado?.categoria === nombreCat);

        if (eventType === 'UPDATE') {
          if (leCorrespondeAEstaVista) {
            const existe = prevProductos.some(p => p.id === prodNormalizado.id);
            if (existe) {
              return prevProductos.map(p => p.id === prodNormalizado.id ? prodNormalizado : p);
            } else {
              return [...prevProductos, prodNormalizado];
            }
          } else {
            // Se desactivó o cambió de categoría
            return prevProductos.filter(p => p.id !== prodNormalizado.id);
          }
        }

        if (eventType === 'DELETE') {
          return prevProductos.filter(p => p.id !== viejoProd.id);
        }

        if (eventType === 'INSERT' && leCorrespondeAEstaVista) {
          return [...prevProductos, prodNormalizado];
        }

        return prevProductos;
      });
    });

    return () => {
      cancelado = true;
      if (canal) canal.unsubscribe();
    };
  }, [categoria, nombreCat, esSeccionDestacados]);

  return (
    <div className="vista-categoria">
      {/* Header con botón Volver y Título */}
      <div className="categoria-header">
        <button className="btn-volver" onClick={onVolver} aria-label="Volver">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="titulo-categoria">
          {nombreCat}
        </h1>
      </div>

      {/* Grilla de Productos */}
      <div className="categoria-body">
        {cargando ? (
          <p className="mensaje-carga">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="mensaje-vacio">No hay productos disponibles en esta sección.</p>
        ) : (
          <div className="productos-grid">
            {productos.map((prod) => (
              <ProductoCard
                key={prod.id}
                producto={prod}
                cantidad={carrito[prod.id]?.cantidad || 0}
                onAgregar={() => onAgregar(prod)}
                onRestar={() => onRestar(prod.id)}
                onEliminar={() => onEliminar(prod.id)}
                onAbrir={() => onAbrirProducto(prod.id, prod)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};