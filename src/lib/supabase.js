import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const STORAGE_BUCKET_ICONS = 'Icons app hub'

/**
 * Obtiene la URL del icono. Si existe imagen (icon), tiene prioridad sobre emoji.
 * - Si icon es una URL completa (http/https) → se usa tal cual
 * - Si icon es una ruta (ej: "powerbi.png") → se resuelve desde el bucket "Icons app hub"
 * - Si no hay icon → retorna null (se usará emoji o letra)
 */
export function getIconUrl(icon) {
  if (!icon) return null
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    return icon
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET_ICONS).getPublicUrl(icon)
  return data.publicUrl
}
