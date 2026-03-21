import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Cliente con service role — SOLO para rutas de servidor/admin
// Nunca exponer al cliente. Ignora RLS.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
