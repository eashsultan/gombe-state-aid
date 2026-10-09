import { createClient } from '@supabase/supabase-js'

// Server-only service client (bypasses RLS). NEVER import from client components.
// Requires SUPABASE_URL + SUPABASE_SERVICE_KEY in the server environment.
let client: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false } })
  }
  return client
}

export const ABSTRACTS_BUCKET = 'abstracts'
export const ABSTRACT_MAX_BYTES = 10 * 1024 * 1024
export const ABSTRACT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
