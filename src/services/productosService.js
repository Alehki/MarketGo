import { supabase } from "../lib/supabaseClient";

// Helper único para remover acentos, tildes, mayúsculas y espacios extra
function removerAcentos(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

async function obtenerDatosCompletos() {
  const [
    { data: productos, error: errProd },
    { data: subcategorias, error: errSub },
    { data: categorias, error: errCat }
  ] = await Promise.all([
    supabase.from("productos").select("*").eq("activo", true),
    // 🟢 Solo traemos subcategorías activas
    supabase.from("subcategorias").select("*").eq("activa", true),
    // 🟢 Solo traemos categorías activas
    supabase.from("categorias").select("*").eq("activa", true)
  ]);

  // 👀 Veamos qué trajo cada tabla y si hay algún error de permisos o conexión
  console.log('🔍 [DIAGNÓSTICO SUPABASE]:', {
    productosCount: productos?.length || 0,
    errProd,
    subcategoriasCount: subcategorias?.length || 0,
    errSub,
    categoriasCount: categorias?.length || 0,
    errCat
  });

  if (errProd || errSub || errCat) {
    console.error("Error al obtener datos desde Supabase:", { errProd, errSub, errCat });
    return [];
  }

  // 1. Mapear categorías por su ID
  const categoriasMap = new Map((categorias || []).map(c => [Number(c.id), c]));
  
  // 2. Mapear subcategorías vinculándolas con su categoría padre
  const subcategoriasMap = new Map((subcategorias || []).map(s => {
    const categoriaPadre = categoriasMap.get(Number(s.categoria_id)) || null;
    return [Number(s.id), { ...s, categorias: categoriaPadre }];
  }));

  // 3. Cruzar cada producto con su subcategoría (y verificar que ambas estén activas)
  return (productos || []).map(p => {
    const subcat = subcategoriasMap.get(Number(p.subcategoria_id)) || null;
    
    // Si el producto apunta a una subcategoría inactiva (o su categoría lo es), lo descartamos
    if (!subcat || !subcat.categorias) {
      return null; 
    }

    const categoriaNombre = subcat.categorias.nombre;

    // 🟢 ESTRICTO: Solo toma imagen_url si existe y es válida. Si no, queda null/vacío.
    const imagenPrincipal = (p.imagen_url && p.imagen_url.startsWith('http')) 
      ? p.imagen_url 
      : null;

    const galeriaImagenes = Array.isArray(p.imagenes) && p.imagenes.length > 0 ? p.imagenes : [imagenPrincipal];

    return {
      ...p,
      imagen_url: imagenPrincipal,
      imagenes: galeriaImagenes,
      colores: Array.isArray(p.colores) ? p.colores : (p.colores ? [p.colores] : []),
      categoria: categoriaNombre,
      subcategoria_nombre: subcat?.nombre || null,
      subcategorias: subcat
    };
  }).filter(Boolean); // Limpiamos los nulos
}

export async function obtenerProductos() {
  return await obtenerDatosCompletos();
}

export async function obtenerListas() {
  const productos = await obtenerProductos();
  return agruparPorCategoria(productos);
}

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
  try {
    const productos = await obtenerDatosCompletos();
    return productos.filter(p => p.destacado === true);
  } catch (err) {
    console.error('Excepción en obtenerProductosDestacados:', err);
    return [];
  }
}

export async function obtenerProductosPorCategoria(nombreCategoria) {
  try {
    if (!nombreCategoria) return [];

    const productos = await obtenerDatosCompletos();
    const busqueda = removerAcentos(nombreCategoria);

    // 👀 Miremos qué categorías tienen TODOS los productos normalizados
    console.log('📦 [LISTA DE CATEGORÍAS EN PRODUCTOS]:', [...new Set(productos.map(p => p.categoria))]);
    console.log(`🔍 [Filtro] Buscando categoría normalizada: "${busqueda}" (Original: "${nombreCategoria}")`);

    return productos.filter(p => removerAcentos(p.categoria) === busqueda);
  } catch (err) {
    console.error('Excepción en obtenerProductosPorCategoria:', err);
    return [];
  }
}

export async function obtenerCategorias() {
  const { data: categoriasDB, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("activa", true);

  if (error) {
    console.error("Error al consultar la tabla 'categorias':", error);
    return [];
  }

  return (categoriasDB || []).map((cat) => {
    const slugNormalizado = cat.slug || removerAcentos(cat.nombre).replace(/\s+/g, "_");

    return {
      id: cat.id,
      nombre: cat.nombre,
      slug: slugNormalizado,
      imagen: cat.imagen_url || `assets/categorias/${slugNormalizado}.webp`,
      activa: cat.activa
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
        callback(payload); 
      }
    )
    .subscribe();

  return canal;
}

export const obtenerSubcategoriasPorCategoria = async (categoriaId) => {
  if (!categoriaId) return [];

  // 🟢 Traemos únicamente las subcategorías que pertenezcan a la categoría y estén activas
  const { data, error } = await supabase
    .from('subcategorias')
    .select('*')
    .eq('categoria_id', categoriaId)
    .eq('activa', true);

  if (error) {
    console.error('Error al obtener subcategorías:', error);
    return [];
  }
  
  return data;
};

// 🟢 Nueva función para buscar productos por texto de forma global (usando tu helper de acentos)
export async function buscarProductosGlobal(termino) {
  try {
    if (!termino || termino.trim() === "") return [];

    // Traemos todos los productos ya cruzados y limpios con tu lógica actual
    const productos = await obtenerDatosCompletos();
    const busquedaLimpieza = removerAcentos(termino);

    // Filtramos buscando coincidencias en el nombre, descripción o categoría
    return productos.filter(p => {
      const nombre = removerAcentos(p.nombre);
      const descripcion = removerAcentos(p.descripcion);
      const categoria = removerAcentos(p.categoria);
      const subcategoria = removerAcentos(p.subcategoria_nombre);

      return (
        nombre.includes(busquedaLimpieza) ||
        descripcion.includes(busquedaLimpieza) ||
        categoria.includes(busquedaLimpieza) ||
        subcategoria.includes(busquedaLimpieza)
      );
    });
  } catch (err) {
    console.error('Excepción en buscarProductosGlobal:', err);
    return [];
  }
}