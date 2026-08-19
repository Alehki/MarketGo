import { useState, useEffect, useRef } from 'react';

// Hooks
import { useCarrito } from './hooks/useCarrito';
import { useCategorias } from './hooks/useCategorias';

// Servicios
import { obtenerProductosDestacados } from './services/productosService';

// Componentes generales
import { Header } from "./componentes/Header/Header.jsx";
import { BarraBeneficios } from './componentes/BarraBeneficios/BarraBeneficios.jsx';
import { Carrusel } from "./componentes/Carrusel/Carrusel.jsx";
import { Destacados } from "./componentes/Destacados/Destacados.jsx";
import { Categorias } from "./componentes/Categorias/Categorias.jsx";
import { BottomNav } from "./componentes/BottomNav/BottomNav.jsx";
import { VistaCategoria } from "./componentes/VistaCategoria/VistaCategoria.jsx";
import { SeccionCategoriaHome } from './componentes/SeccionCategoriaHome/SeccionCategoriaHome.jsx';
import { SeccionBanners } from './componentes/BannerPromo/SeccionBanners.jsx';

// Modales
import { CardModal } from "./componentes/CardModal/CardModal.jsx";
import { ModalProductoDetalle } from "./componentes/ModalProductoDetalle/ModalProductoDetalle.jsx";
import { SplashScreen } from './componentes/SplashScreen/SplashScreen.jsx';

const bannerPromo = `${import.meta.env.BASE_URL}bannerPromo.jpg`;
const faviconSvg = `${import.meta.env.BASE_URL}favicon.svg`;

const COMPRA_MINIMA = 5000;

function App() {
  const [tabActiva, setTabActiva] = useState('inicio');
  const [modalCarritoAbierta, setModalCarritoAbierta] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estado para la categoría actualmente abierta
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const { categorias, loading: cargandoCategorias } = useCategorias();
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [cargandoDestacados, setCargandoDestacados] = useState(true);

  const {
    carrito,
    agregarItem,
    restarItem,
    eliminarItem,
    total,
    cantidadTotalItems,
    faltaParaMinimo,
    cumpleMinimo
  } = useCarrito(COMPRA_MINIMA);

  // Ejemplo de datos para tus banners
  const BANNERS_PROMO = [
    {
      id: 'nestle-week',
      imagen: bannerPromo, // O URL de imagen
      categoriaDestino: 'Nestlé'
    },
    {
      id: 'oreo-promo',
      imagen: faviconSvg,
      categoriaDestino: 'Galletitas'
    }
  ];

  useEffect(() => {
    async function cargarDatos() {
      setCargandoDestacados(true);
      const datos = await obtenerProductosDestacados();
      setProductosDestacados(datos);
      setCargandoDestacados(false);
    }
    cargarDatos();
  }, []);

  // --- ESCUCHAR BOTÓN ATRÁS DEL CELULAR (POPSTATE) ---
  useEffect(() => {
    const handlePopState = () => {
      // Al presionar atrás en el celular, cerramos la categoría
      setCategoriaSeleccionada(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handler para abrir la categoría
  const handleAbrirCategoria = (cat) => {
    window.history.pushState({ vista: 'categoria' }, ''); // 1. Empujamos estado al historial del celu
    setCategoriaSeleccionada(cat); // 2. Abrimos categoría
    window.scrollTo(0, 0); // 3. Llevamos el scroll arriba para ver el detalle
  };

  // Handler para la flecha/botón de volver visual de la vista
  const handleVolverDeCategoria = () => {
    if (window.history.state?.vista === 'categoria') {
      window.history.back(); // Gatilla el evento 'popstate' de forma limpia
    } else {
      setCategoriaSeleccionada(null);
    }
  };

  const handleEliminarDesdeDetalle = (id) => {
    eliminarItem(id);
    setProductoSeleccionado(null);
  };

  const handleEliminarDesdeCarrito = (id) => {
    const esElUltimo = Object.keys(carrito).length === 1;
    eliminarItem(id);
    if (esElUltimo) {
      setModalCarritoAbierta(false);
    }
  };

  return (
    <div className="app-container">
      <SplashScreen duracion={3200} />

      <Header 
        cantidadCarrito={cantidadTotalItems} 
        onAbrirCarrito={() => setModalCarritoAbierta(true)} 
      />

      <main className="main-content">
        {/* Pestaña Inicio */}
        <div style={{ display: tabActiva === 'inicio' ? 'block' : 'none' }}>
          
          {/* 1. VISTA DE CATEGORÍA (Solo visible si hay seleccionada una) */}
          {categoriaSeleccionada && (
            <VistaCategoria 
              categoria={categoriaSeleccionada}
              onVolver={handleVolverDeCategoria}
              carrito={carrito}
              onAgregar={agregarItem}
              onRestar={restarItem}
              onEliminar={eliminarItem}
              onAbrirProducto={(id, prod) => setProductoSeleccionado(prod)}
            />
          )}

          {/* 2. CONTENIDO COMPLETO DEL HOME (Oculto 100% cuando hay una categoría abierta) */}
          <div style={{ display: categoriaSeleccionada ? 'none' : 'block' }}>
            <BarraBeneficios />
            <Carrusel />
            
            {cargandoDestacados ? (
              <p style={{ textAlign: 'center', padding: '1rem' }}>Cargando destacados...</p>
            ) : (
              <Destacados 
                productos={productosDestacados}
                carrito={carrito}
                onAgregar={(id, prod) => agregarItem(prod)}
                onRestar={(id) => restarItem(id)}
                onEliminar={(id) => eliminarItem(id)}
                onAbrirProducto={(id) => {
                  const prod = productosDestacados.find(p => p.id === id);
                  if (prod) setProductoSeleccionado(prod);
                }}
              />
            )}


            <Categorias 
              categorias={categorias}
              loading={cargandoCategorias}
              onSeleccionarCategoria={handleAbrirCategoria}
            />

            <SeccionBanners 
              banners={BANNERS_PROMO}
              onSeleccionarBanner={(banner) => {
                // Al tocar el banner te puede llevar a una categoría o filtro especial
                handleAbrirCategoria({ nombre: banner.categoriaDestino });
              }}
            />

            {/* 1. Para "Los más vendidos" (usa esDestacados) */}
            <SeccionCategoriaHome 
              titulo="Los más vendidos"
              nombreCategoria="Los más vendidos"
              esDestacados={true}
              carrito={carrito}
              onAgregar={agregarItem}
              onRestar={restarItem}
              onEliminar={eliminarItem}
              onAbrirProducto={(id, prod) => setProductoSeleccionado(prod)}
              onMostrarTodos={(cat) => handleAbrirCategoria(cat)} 
            />

            {/* 2. Para categorías reales de Supabase (ej: Bebidas) */}
            <SeccionCategoriaHome 
              titulo="Bebidas e Hidratación"
              nombreCategoria="almacen"
              carrito={carrito}
              onAgregar={agregarItem}
              onRestar={restarItem}
              onEliminar={eliminarItem}
              onAbrirProducto={(id, prod) => setProductoSeleccionado(prod)}
              onMostrarTodos={(cat) => handleAbrirCategoria(cat)} 
            />
          </div>

        </div>

        {/* Pestaña Pedidos */}
        <div style={{ display: tabActiva === 'pedidos' ? 'block' : 'none' }}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Mis Pedidos</h2>
          </div>
        </div>

        {/* Pestaña Perfil */}
        <div style={{ display: tabActiva === 'perfil' ? 'block' : 'none' }}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Mi Perfil</h2>
          </div>
        </div>
      </main>

      {/* Modales */}
      <CardModal
        isOpen={modalCarritoAbierta}
        onClose={() => setModalCarritoAbierta(false)}
        carrito={carrito}
        total={total}
        faltaParaMinimo={faltaParaMinimo}
        cumpleMinimo={cumpleMinimo}
        onAgregar={agregarItem}
        onRestar={restarItem}
        onEliminar={handleEliminarDesdeCarrito}
        onIrAPagar={() => setModalCarritoAbierta(false)}
      />

      <ModalProductoDetalle 
        producto={productoSeleccionado}
        isOpen={Boolean(productoSeleccionado)}
        onClose={() => setProductoSeleccionado(null)}
        cantidad={productoSeleccionado ? (carrito[productoSeleccionado.id]?.cantidad || 0) : 0}
        onAgregar={(prod) => agregarItem(prod)}
        onRestar={(id) => restarItem(id)}
        onEliminar={handleEliminarDesdeDetalle}
      />

      <BottomNav 
        tabActiva={tabActiva} 
        setTabActiva={(tab) => {
          setTabActiva(tab);
          if (tab !== 'inicio') setCategoriaSeleccionada(null);
        }}
        tienePedidosActivos={false}
      />
    </div>
  );
}

export default App;