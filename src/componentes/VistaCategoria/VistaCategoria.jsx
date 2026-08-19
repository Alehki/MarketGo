import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { obtenerProductosPorCategoria, obtenerProductosDestacados } from '../../services/productosService';
import './VistaCategoria.css';

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

  useEffect(() => {
    async function cargarProductos() {
      if (!categoria) return;
      setCargando(true);
      
      const nombreCat = typeof categoria === 'string' ? categoria : categoria.nombre;
      
      let datos = [];

      // 🔴 SI ES LA SECCIÓN ESPECIAL "LOS MÁS VENDIDOS" O "DESTACADOS"
      if (nombreCat === "Los más vendidos" || nombreCat === "Destacados") {
        datos = await obtenerProductosDestacados();
      } else {
        // SI ES UNA CATEGORÍA NORMAL DE SUPABASE (Lácteos, Bebidas, etc.)
        datos = await obtenerProductosPorCategoria(nombreCat);
      }
      
      setProductos(datos || []);
      setCargando(false);
    }

    cargarProductos();
  }, [categoria]);

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
          {typeof categoria === 'string' ? categoria : categoria.nombre}
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