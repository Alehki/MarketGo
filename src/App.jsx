import { useState, useEffect, useRef } from 'react';

// Hooks
import { useCarrito } from './hooks/useCarrito';
import { useCategorias } from './hooks/useCategorias';
import { useSugerenciasBusqueda } from './hooks/useSugerenciasBusqueda';

// Servicios
import { obtenerProductosDestacados, suscribirseAProductos } from './services/productosService';
import { crearPedido, obtenerPedidosCliente, suscribirseAPedidos } from './services/pedidosServices.js'; // <-- Importamos los servicios de pedidos

// Componentes generales
import { Header } from "./componentes/Header/Header.jsx";
import { BuscadorDesplegable } from './componentes/BuscadorDesplegable/BuscadorDesplegable.jsx';
import { BarraBeneficios } from './componentes/BarraBeneficios/BarraBeneficios.jsx';
import { Carrusel } from "./componentes/Carrusel/Carrusel.jsx";
import { Destacados } from "./componentes/Destacados/Destacados.jsx";
import { Categorias } from "./componentes/Categorias/Categorias.jsx";
import { BottomNav } from "./componentes/BottomNav/BottomNav.jsx";
import { VistaCategoria } from "./componentes/VistaCategoria/VistaCategoria.jsx";
import { SeccionCategoriaHome } from './componentes/SeccionCategoriaHome/SeccionCategoriaHome.jsx';
import { SeccionBanners } from './componentes/BannerPromo/SeccionBanners.jsx';
import { CartFloatingBar } from './componentes/CartFloatingBar/CartFloatingBar.jsx';
import { VistaResultadosBusqueda } from './componentes/vistaResultadosBusqueda/vistaResultadosBusqueda.jsx';

// Modales
import { CardModal } from "./componentes/CardModal/CardModal.jsx";
import { ModalProductoDetalle } from "./componentes/ModalProductoDetalle/ModalProductoDetalle.jsx";
import { SplashScreen } from './componentes/SplashScreen/SplashScreen.jsx';
import { ModalResumenPedido } from "./componentes/ModalResumenPedido/ModalResumenPedido.jsx";
import { SeccionPedidos } from './componentes/SeccionPedidos/SeccionPedidos.jsx';


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

  // Cantidad de pedidos activos globales
  const [cantidadPedidosActivos, setCantidadPedidosActivos] = useState(0);

  // ModalResumen
  const [modalResumenAbierta, setModalResumenAbierta] = useState(false);

  const [buscadorAbierto, setBuscadorAbierto] = useState(false);

  //  Nuevo estado para lo que tipea en tiempo real
  const [terminoEscrito, setTerminoEscrito] = useState(''); 

  //  Llamamos al hook de sugerencias con el texto en tiempo real
  const { sugerencias, cargando: cargandoSugerencias } = useSugerenciasBusqueda(terminoEscrito);

  // Para el vistaGenralDeProductos
  const [terminoBusquedaActiva, setTerminoBusquedaActiva] = useState(null);
  

  const handleIrAPagar = () => {
    setModalCarritoAbierta(false);
    setModalResumenAbierta(true);
  };

  const handleVolverAlCarrito = () => {
    setModalResumenAbierta(false);
    setModalCarritoAbierta(true);
  };

  const {
    carrito,
    agregarItem,
    restarItem,
    eliminarItem,
    vaciarCarrito,
    total,
    cantidadTotalItems,
    faltaParaMinimo,
    cumpleMinimo
  } = useCarrito(COMPRA_MINIMA);

  // --- SUSCRIPCIÓN GLOBAL REALTIME PARA CONTADOR DE PEDIDOS ---
  const actualizarContadorGlobalPedidos = async () => {
    try {
      const pedidos = await obtenerPedidosCliente();
      const activos = pedidos.filter(p => p.estado !== 'entregado');
      setCantidadPedidosActivos(activos.length);
    } catch (err) {
      console.error("Error consultando pedidos activos:", err);
    }
  };

  useEffect(() => {
    actualizarContadorGlobalPedidos();

    // Se suscribe globalmente para que funcione aunque estés en el Home
    const canalPedidos = suscribirseAPedidos(() => {
      actualizarContadorGlobalPedidos();
    });

    return () => {
      if (canalPedidos) canalPedidos.unsubscribe();
    };
  }, []);

  // Crear o hacer pedido
  const handleConfirmarPedido = async (datosCliente) => {
    try {
      // 1. Llama a tu función RPC de Supabase
      await crearPedido(carrito, datosCliente);

      // 2. Cierra la modal
      setModalResumenAbierta(false);

      // 3. Limpia el carrito
      if (vaciarCarrito) vaciarCarrito();

      // 4. Actualizamos el contador de forma inmediata
      await actualizarContadorGlobalPedidos();

      // 5. Te redirige a la solapa de pedidos
      setTabActiva('pedidos');

    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      alert("Ocurrió un problema al procesar el pedido. Intentá nuevamente.");
    }
  };

  // Banners Promo
  const BANNERS_PROMO = [
    {
      id: 'nestle-week',
      imagen: bannerPromo,
      categoriaDestino: 'Nestlé'
    },
    {
      id: 'oreo-promo',
      imagen: faviconSvg,
      categoriaDestino: 'Galletitas'
    }
  ];

  // Carga de destacados y suscripción a productos
  useEffect(() => {
    async function cargarDatos() {
      setCargandoDestacados(true);
      const datos = await obtenerProductosDestacados();
      setProductosDestacados(datos);
      setCargandoDestacados(false);
    }
    cargarDatos();

    const canal = suscribirseAProductos(async () => {
      const datosActualizados = await obtenerProductosDestacados();
      setProductosDestacados(datosActualizados);
    });

    return () => {
      if (canal) canal.unsubscribe();
    };
  }, []);

  // Manejo del botón Atrás del celular
  useEffect(() => {
    const handlePopState = () => {
      setCategoriaSeleccionada(null);
      setTerminoBusquedaActiva(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleAbrirCategoria = (cat) => {
    window.history.pushState({ vista: 'categoria' }, '');
    setCategoriaSeleccionada(cat);
    window.scrollTo(0, 0);
  };

  const handleVolverDeCategoria = () => {
    if (window.history.state?.vista === 'categoria') {
      window.history.back();
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

  // ------

  const handleEjecutarBusquedaGlobal = (textoBuscado) => {
    // 1. Guardamos el estado de que estamos buscando esto
    setTerminoBusquedaActiva(textoBuscado);
    
    // 2. Si querés que funcione con el botón de atrás del navegador igual que las categorías:
    window.history.pushState({ vista: 'busqueda', termino: textoBuscado }, '');
    
    // 3. Subimos arriba del todo para que vea bien la grilla de resultados
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <SplashScreen duracion={3200} />

      <Header 
        cantidadCarrito={cantidadTotalItems} 
        onAbrirCarrito={() => setModalCarritoAbierta(true)} 
        onAbrirBuscador={() => setBuscadorAbierto(true)}
      />

      {/* Renderizado condicional del overlay de búsqueda */}
      <BuscadorDesplegable 
        isOpen={buscadorAbierto}
        onClose={() => setBuscadorAbierto(false)}
        cantidadCarrito={cantidadTotalItems}
        onAbrirCarrito={() => {
          setBuscadorAbierto(false);
          setModalCarritoAbierta(true);
        }}
        terminoEscrito={terminoEscrito}                  
        onTerminoChange={setTerminoEscrito}               
        sugerencias={sugerencias}                         
        cargandoSugerencias={cargandoSugerencias}          
        onSearch={(texto) => {
          setTerminoEscrito('');                          {/* Limpiamos al buscar completo */}
          handleEjecutarBusquedaGlobal(texto);
        }}
        onSelectSugerencia={(nombreProducto) => {         {/* 🟢 Cambiamos a onSelectSugerencia */}
          setTerminoEscrito('');
          setBuscadorAbierto(false);
          handleEjecutarBusquedaGlobal(nombreProducto);   {/* 🟢 Dispara la búsqueda global */}
        }}
      />

      <main className="main-content">
        {/* Pestaña Inicio */}
        <div style={{ display: tabActiva === 'inicio' ? 'block' : 'none' }}>
          
          {/* 1. VISTA DE BÚSQUEDA GLOBAL */}
          {terminoBusquedaActiva ? (
            <VistaResultadosBusqueda 
              terminoBusqueda={terminoBusquedaActiva}
              onVolver={() => setTerminoBusquedaActiva(null)} 
              onSelectProduct={(producto) => setProductoSeleccionado(producto)}
              carrito={carrito}
              onAgregar={agregarItem}    
              onRestar={restarItem}        
              onEliminar={eliminarItem}
            />
          ) : (
            <>
              {/* 2. VISTA DE CATEGORÍA */}
              {categoriaSeleccionada && (
                <VistaCategoria 
                  categoria={categoriaSeleccionada}
                  categorias={categorias}                    
                  cargandoCategorias={cargandoCategorias}   
                  onSeleccionarCategoria={handleAbrirCategoria} 
                  onVolver={handleVolverDeCategoria}
                  carrito={carrito}
                  onAgregar={agregarItem}
                  onRestar={restarItem}
                  onEliminar={eliminarItem}
                  onAbrirProducto={(id, prod) => setProductoSeleccionado(prod)}
                />
              )}

              {/* 3. HOME DE SIEMPRE (Se oculta si hay categoría seleccionada) */}
              <div style={{ display: categoriaSeleccionada ? 'none' : 'block' }}>
                <BarraBeneficios />
                <Carrusel />

                <Categorias 
                  categorias={categorias}
                  loading={cargandoCategorias}
                  onSeleccionarCategoria={handleAbrirCategoria}
                />
                
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

                <SeccionBanners 
                  banners={BANNERS_PROMO}
                  onSeleccionarBanner={(banner) => {
                    handleAbrirCategoria({ nombre: banner.categoriaDestino });
                  }}
                />

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
            </>
          )}

        </div>

        {/* Pestaña Pedidos */}
        <div style={{ display: tabActiva === 'pedidos' ? 'block' : 'none' }}>
          <SeccionPedidos onActualizarCantidadActivos={setCantidadPedidosActivos} />
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
        onIrAPagar={handleIrAPagar}
      />

      <ModalResumenPedido 
        isOpen={modalResumenAbierta}
        onClose={() => setModalResumenAbierta(false)}
        onVolver={handleVolverAlCarrito}
        carrito={carrito}
        total={total}
        costoEnvio={900}
        onEnviarWhatsApp={handleConfirmarPedido}
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

      {/* BARRA FLOTANTE DEL CARRITO */}
      {!modalCarritoAbierta && !modalResumenAbierta && (
        <CartFloatingBar 
          totalItems={cantidadTotalItems}
          totalPrice={total}
          onOpenCart={() => setModalCarritoAbierta(true)}
        />
      )}

      <BottomNav 
        tabActiva={tabActiva} 
        setTabActiva={(tab) => {
          setTabActiva(tab);
          if (tab !== 'inicio'){
            setCategoriaSeleccionada(null);
            setTerminoBusquedaActiva(null);
          } 
        }}
        pedidosActivos={cantidadPedidosActivos}
      />
    </div>
  );
}

export default App;