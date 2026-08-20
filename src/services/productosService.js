import { supabase } from "../lib/supabaseClient";

// Helper interno para formatear imagenes y colores
function normalizarProducto(p) {
  return {
    ...p,
    imagenes: Array.isArray(p.imagenes)
      ? p.imagenes
      : (p.imagenes ? [p.imagenes] : []),
    colores: Array.isArray(p.colores)
      ? p.colores
      : (p.colores ? [p.colores] : [])
  };
}

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error("Error al obtener productos desde Supabase:", error);
    return [];
  }

  return data.map(normalizarProducto);
}

export async function obtenerListas() {
  const productos = await obtenerProductos();
  return agruparPorCategoria(productos);
}

// Helper interno
function agruparPorCategoria(productos) {
  const resultado = {};

  productos.forEach((p) => {
    if (!resultado[p.categoria]) {
      resultado[p.categoria] = [];
    }
    resultado[p.categoria].push(p);
  });

  return resultado;
}

export async function obtenerProductosDestacados() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .eq("destacado", true);

  if (error) {
    console.error("Error al obtener destacados:", error);
    return [];
  }

  return data.map(normalizarProducto);
}

// Nueva función para traer productos por categoría
export async function obtenerProductosPorCategoria(categoriaNombre) {
  if (!categoriaNombre) return [];

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .eq("categoria", categoriaNombre);

  if (error) {
    console.error(`Error al obtener productos de la categoría ${categoriaNombre}:`, error);
    return [];
  }

  return data.map(normalizarProducto);
}

export async function obtenerCategorias() {
  const productos = await obtenerProductos();

  // 1. Extraemos todas las categorías sin repetir
  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))].filter(Boolean);

  // 2. Mapeamos la estructura para CategoriaCard
  return categoriasUnicas.map((nombre, index) => {
    const primerProd = productos.find((p) => p.categoria === nombre);

    return {
      id: nombre || index,
      nombre: nombre,
      imagen: primerProd?.imagenes?.[0] || ""
    };
  });
}

export function suscribirseAProductos(callback) {
  const canalId = `productos-realtime-${Math.random().toString(36).substring(2, 9)}`;

  const canal = supabase
    .channel(canalId)
    .on(
      'postgres_changes',
      {
        event: '*', 
        schema: 'public',
        table: 'productos'
      },
      (payload) => {
        // Le pasamos el payload con la info del cambio (new, old, eventType)
        callback(payload); 
      }
    )
    .subscribe();

  return canal;
}