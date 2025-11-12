const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY
const LABS_SCHEMA = process.env.LABS_SCHEMA || 'labs'

function getClients() {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Missing Supabase URL or anon key in environment')
  }
  const anon = createClient(SUPABASE_URL, SUPABASE_ANON)
  const svc = SUPABASE_SERVICE ? createClient(SUPABASE_URL, SUPABASE_SERVICE) : null
  // Provide schema helper by wrapping createClient with schema setting
  const wrap = (client) => ({
    from: (table) => client.from(table).schema ? client.from(table) : client.from(table),
    client,
  })
  return { anon, svc, LABS_SCHEMA }
}

function errorResponse(res, status, message, details) {
  return res.status(status).json({ error: message, details })
}

module.exports = { getClients, errorResponse }
