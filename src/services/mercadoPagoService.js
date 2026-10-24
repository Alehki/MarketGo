import { supabase } from '../lib/supabaseClient.js';
import { obtenerClienteId } from '../utils/cliente';

/**
 * Llama a la Edge Function de Supabase para crear la preferencia de pago en Mercado Pago.
 * @param {Array} carritoItems - Los ítems normalizados del carrito.
 * @param {Object} datosCliente - Dirección, teléfono, referencia, cliente_id, etc.
 * @returns {Promise<Object>} Objeto con el init_point y el orderId.
 */
export async function crearPreferenciaMercadoPago(carritoItems, datosCliente) {
  try {
    const itemsParaBackend = carritoItems.map(item => ({
      productId: item.id || item.product_id,
      quantity: item.cantidad || item.qty
    }));

    const clienteIdSeguro = obtenerClienteId();

    const { data, error } = await supabase.functions.invoke('create-preference', {
      body: {
        items: itemsParaBackend,
        shippingCost: 900,
        direccion: datosCliente.direccion,
        telefono: datosCliente.telefono,
        referencia: datosCliente.referencia || '',
        cliente_id: clienteIdSeguro
      }
    });

    if (error) {
      // Intentamos extraer el detalle técnico si viene empaquetado en el error de la función
      if (error instanceof Error && 'context' in error) {
        try {
          const context = await error.context.json();
          console.error("Detalle técnico del servidor (Edge Function):", context);
          throw new Error(context.error || "Error en el servidor de la Edge Function");
        } catch (e) {
          // Si no se puede parsear como JSON, lanzamos el error original
        }
      }
      throw error;
    }

    if (!data || !data.init_point) {
      throw new Error("La respuesta del servidor no devolvió un link de pago válido.");
    }

    return data; // Retorna { init_point, orderId }
  } catch (error) {
    console.error("Error en mercadoPagoService:", error);
    throw error;
  }
}