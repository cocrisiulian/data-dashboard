/*
  Labs API (Express) — standalone endpoints for lab exercises
  - Uses Supabase JS with a dedicated schema (LABS_SCHEMA, default 'labs')
  - Plans: public read; writes use service-role key if present (or RLS dev policies)
  - Dashboards: user-scoped via 'x-user-id' header for demo purposes

  Run:
    npm run labs:dev
  Env:
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY (optional, for server writes)
    LABS_SCHEMA=labs (default)
    LABS_API_PORT=4000 (default)
*/

const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Routers (MVC)
const plansRouter = require('./routes/plans')
const dashboardsRouter = require('./routes/dashboards')

// Load local env if present
const envLocal = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envLocal)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: envLocal })
}

const PORT = process.env.LABS_API_PORT || 4000
const LABS_SCHEMA = process.env.LABS_SCHEMA || 'labs'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('Missing Supabase URL or ANON key. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Mount our routers
app.use('/labs/plans', plansRouter)
app.use('/labs/dashboards', dashboardsRouter)

function getClients() {
  const anon = createClient(SUPABASE_URL, SUPABASE_ANON)
  const svc = SUPABASE_SERVICE ? createClient(SUPABASE_URL, SUPABASE_SERVICE) : null
  return { anon, svc }
}

function errorResponse(res, status, message, details) {
  return res.status(status).json({ error: message, details })
}

// Health
app.get('/labs/health', (_req, res) => {
  res.json({ ok: true, schema: LABS_SCHEMA })
})

// -------------------- Plans (Lab5) --------------------
// GET /labs/plans
app.get('/labs/plans', async (_req, res) => {
  try {
    const { anon } = getClients()
    const supa = anon.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('plans')
      .select('id, name, max_files, max_charts, max_dashboards, price, created_at')
      .order('price', { ascending: true })
    if (error) return errorResponse(res, 500, 'Failed to fetch plans', error.message)
    res.json(data || [])
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// GET /labs/plans/:id
app.get('/labs/plans/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { anon } = getClients()
    const supa = anon.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('plans')
      .select('id, name, max_files, max_charts, max_dashboards, price, created_at')
      .eq('id', id)
      .maybeSingle()
    if (error) return errorResponse(res, 500, 'Failed to fetch plan', error.message)
    if (!data) return errorResponse(res, 404, 'Plan not found')
    res.json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// POST /labs/plans
app.post('/labs/plans', async (req, res) => {
  try {
    const { name, price } = req.body || {}
    if (!name || typeof price === 'undefined') {
      return errorResponse(res, 400, 'Missing name or price')
    }
    const { anon, svc } = getClients()
    const base = svc || anon
    const supa = base.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('plans')
      .insert({ name, price })
      .select('id, name, max_files, max_charts, max_dashboards, price, created_at')
      .single()
    if (error) {
      const msg = error.message || 'Unknown error'
      if (msg.toLowerCase().includes('row-level security')) {
        return errorResponse(res, 403, 'RLS blocked insert. Provide SUPABASE_SERVICE_ROLE_KEY or relax INSERT policy in labs.plans.', msg)
      }
      return errorResponse(res, 500, 'Failed to create plan', msg)
    }
    res.status(201).json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// PATCH /labs/plans/:id
app.patch('/labs/plans/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, price } = req.body || {}
    if (!id || (!name && typeof price === 'undefined')) {
      return errorResponse(res, 400, 'Missing id or fields to update')
    }
    const { anon, svc } = getClients()
    const base = svc || anon
    const supa = base.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('plans')
      .update({ ...(name !== undefined ? { name } : {}), ...(price !== undefined ? { price } : {}) })
      .eq('id', id)
      .select('id, name, max_files, max_charts, max_dashboards, price, created_at')
      .single()
    if (error) {
      const msg = error.message || 'Unknown error'
      if (msg.toLowerCase().includes('row-level security')) {
        return errorResponse(res, 403, 'RLS blocked update. Provide SUPABASE_SERVICE_ROLE_KEY or relax UPDATE policy in labs.plans.', msg)
      }
      return errorResponse(res, 500, 'Failed to update plan', msg)
    }
    res.json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// -------------------- Dashboards (Lab6) --------------------
// NOTE: For demo simplicity, we scope by header 'x-user-id'. In production, you should verify a user token.

// GET /labs/dashboards
app.get('/labs/dashboards', async (req, res) => {
  try {
    const userId = req.header('x-user-id')
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')

    const { anon } = getClients()
    const supa = anon.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('dashboards')
      .select('id, user_id, name, description, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) return errorResponse(res, 500, 'Failed to fetch dashboards', error.message)
    res.json(data || [])
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// GET /labs/dashboards/:id
app.get('/labs/dashboards/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.header('x-user-id')
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')

    const { anon } = getClients()
    const supa = anon.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('dashboards')
      .select('id, user_id, name, description, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle()
    if (error) return errorResponse(res, 500, 'Failed to fetch dashboard', error.message)
    if (!data) return errorResponse(res, 404, 'Dashboard not found')
    res.json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// POST /labs/dashboards
app.post('/labs/dashboards', async (req, res) => {
  try {
    const userId = req.header('x-user-id')
    const { name, description } = req.body || {}
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')
    if (!name) return errorResponse(res, 400, 'Missing name')

    const { anon } = getClients()
    const supa = anon.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('dashboards')
      .insert({ user_id: userId, name, description: description ?? null })
      .select('id, user_id, name, description, created_at, updated_at')
      .single()
    if (error) return errorResponse(res, 500, 'Failed to create dashboard', error.message)
    res.status(201).json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// PATCH /labs/dashboards/:id
app.patch('/labs/dashboards/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.header('x-user-id')
    const { name, description } = req.body || {}
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')

    const { anon } = getClients()
    const supa = anon.schema(LABS_SCHEMA)
    const { data, error } = await supa
      .from('dashboards')
      .update({ ...(name !== undefined ? { name } : {}), ...(description !== undefined ? { description } : {}) })
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, user_id, name, description, created_at, updated_at')
      .single()
    if (error) return errorResponse(res, 500, 'Failed to update dashboard', error.message)
    res.json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

app.listen(PORT, () => {
  console.log(`Labs API listening on http://localhost:${PORT}`)
})
