import { supabase } from '../lib/supabaseClient';

export const getCarouselSlides = async () => {
  try {
    const { data, error } = await supabase
      .from('carrusel_slides')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener los slides:', error.message);
    return [];
  }
};