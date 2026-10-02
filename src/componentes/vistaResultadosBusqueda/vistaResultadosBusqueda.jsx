import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard';
import { buscarProductosGlobal } from '../../services/productosService';
import './VistaResultadosBusqueda.css';

export function VistaResultadosBusqueda({ 
  terminoBusqueda, 
  onVolver, 
  onSelectProduct,
  carrito,
  onAgregar,
  onRestar,
  onEliminar
}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarResultados() {
      if (!terminoBusqueda) return;
      setCargando(true);
      
      const resultados = await buscarProductosGlobal(terminoBusqueda);
      setProductos(resultados);
      setCargando(false);
    }

    cargarResultados();
  }, [terminoBusqueda]);

  return (
    <div className="vista-resultados-container">
      {/* Barra superior con botón para volver */}
      <div className="resultados-header">
        <button className="btn-volver" onClick={onVolver}>
          ←
        </button>
        <h2>Resultados para: "{terminoBusqueda}"</h2>
      </div>

      {/* Contenido / Grilla */}
      <div className="resultados-body">
        {cargando && <p className="mensaje-estado">Buscando productos...</p>}

        {!cargando && productos.length === 0 && (
          <div className="sin-resultados">
            <p>No encontramos productos que coincidan con tu búsqueda.</p>
            <span>Probá buscando con otras palabras o revisá el catálogo.</span>
          </div>
        )}

        {!cargando && productos.length > 0 && (
          <div className="grilla-productos-busqueda">
            {productos.map((producto) => {
              // Obtenemos la cantidad que hay de este producto en el carrito (si hay)
              const cantidadEnCarrito = carrito[producto.id]?.cantidad || 0;

              return (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  cantidad={cantidadEnCarrito}       
                  onAgregar={onAgregar}            
                  onRestar={onRestar}              
                  onEliminar={onEliminar}           
                  onAbrir={() => onSelectProduct(producto)} /* Abre el modal de detalle */
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}