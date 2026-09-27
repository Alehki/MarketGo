import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../ProductoCard/ProductoCard.jsx';
import { 
  obtenerProductosPorCategoria, 
  obtenerProductosDestacados, 
  suscribirseAProductos,
  obtenerSubcategoriasPorCategoria
} from '../../services/productosService';
import './VistaCategoria.css';
import { CategoriasPills } from '../CategoriasPills/CategoriasPills.jsx';
import { SubcategoriasPills } from '../SubcategoriasPills/SubcategoriasPills.jsx';

// Helper local para normalizar textos y comparar sin errores de tildes/mayúsculas
function normalizarTexto(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

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
  categorias,
  cargandoCategorias,
  onSeleccionarCategoria,
  onVolver, 
  carrito = {}, 
  onAgregar, 
  onRestar, 
  onEliminar,
  onAbrirProducto 
}) => {

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  //------------------

  const [subcategorias, setSubcategorias] = useState([]);                  // Guarda la lista de subcategorías de la categoría actual
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null); // Guarda cuál pill de subcategoría clickeó el usuario (o null si no hay ninguna)
  const [cargandoSubcategorias, setCargandoSubcategorias] = useState(false);     // Controla el estado de carga mientras busca las subcategorías

  const nombreCat = typeof categoria === 'string' ? categoria : categoria?.nombre;
  const esSeccionDestacados = nombreCat === "Los más vendidos" || nombreCat === "Destacados";

  const categoriaId = categoria?.id;

  useEffect(() => {
    let cancelado = false;

    async function cargarSubcats() {
      if (!categoriaId || esSeccionDestacados) {
        setSubcategorias([]);
        setSubcategoriaSeleccionada(null);
        return;
      }

      setCargandoSubcategorias(true);
      try {
        const dataSub = await obtenerSubcategoriasPorCategoria(categoriaId);
        if (!cancelado) {
          setSubcategorias(dataSub || []);
          setSubcategoriaSeleccionada(null);
        }
      } catch (error) {
        console.error("Error al cargar subcategorías:", error);
      } finally {
        if (!cancelado) setCargandoSubcategorias(false);
      }
    }

    cargarSubcats();

    return () => {
      cancelado = true;
    };
  }, [categoriaId, esSeccionDestacados]);
  // ---------------
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

        // Verificación robusta ignorando tildes y mayúsculas en tiempo real
        const categoriaProdNormalizada = normalizarTexto(prodNormalizado?.categoria);
        const nombreCatNormalizado = normalizarTexto(nombreCat);

        const leCorrespondeAEstaVista = esSeccionDestacados
          ? (prodNormalizado?.activo && prodNormalizado?.destacado)
          : (prodNormalizado?.activo && categoriaProdNormalizada === nombreCatNormalizado);

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

  // 🟢 Filtramos los productos si el usuario seleccionó una subcategoría específica
  const productosFiltrados = subcategoriaSeleccionada 
    ? productos.filter(p => Number(p.subcategoria_id) === Number(subcategoriaSeleccionada.id))
    : productos;

  return (
    <div className="vista-categoria">
      {/* 🟢 BARRA DE CATEGORÍAS PILLS ARRIBA DE TODO */}
      <CategoriasPills 
        categorias={categorias}
        loading={cargandoCategorias}
        categoriaSeleccionada={categoria}
        onSeleccionarCategoria={onSeleccionarCategoria}
      />
      {/* Barra de Subcategorías */}
      {!esSeccionDestacados && (
        <SubcategoriasPills 
          subcategorias={subcategorias}
          loading={cargandoSubcategorias}
          subcategoriaSeleccionada={subcategoriaSeleccionada}
          onSeleccionarSubcategoria={(subcat) => setSubcategoriaSeleccionada(subcat)}
        />
      )}
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
        ) : productosFiltrados.length === 0 ? (
          <p className="mensaje-vacio">No hay productos disponibles en esta sección.</p>
        ) : (
          <div className="productos-grid">
            {productosFiltrados.map((prod) => (
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