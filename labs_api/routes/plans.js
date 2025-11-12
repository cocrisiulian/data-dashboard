const express = require('express')
const router = express.Router()
const { getClients, errorResponse } = require('../services/supabase')

// GET /labs/plans
router.get('/', async (req, res) => {
  try {
    const { anon } = getClients()
    const supa = anon
    const { data, error } = await supa.from('plans').select('id, name, max_files, max_charts, max_dashboards, price, created_at').order('price', { ascending: true })
    if (error) return errorResponse(res, 500, 'Failed to fetch plans', error.message)
    res.json(data || [])
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// GET /labs/plans/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { anon } = getClients()
    const { data, error } = await anon.from('plans').select('id, name, max_files, max_charts, max_dashboards, price, created_at').eq('id', id).maybeSingle()
    if (error) return errorResponse(res, 500, 'Failed to fetch plan', error.message)
    if (!data) return errorResponse(res, 404, 'Plan not found')
    res.json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// POST /labs/plans
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body || {}
    if (!name || typeof price === 'undefined') {
      return errorResponse(res, 400, 'Missing name or price')
    }
    const { anon, svc } = getClients()
    const base = svc || anon
    const { data, error } = await base.from('plans').insert({ name, price }).select('id, name, max_files, max_charts, max_dashboards, price, created_at').single()
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
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, price } = req.body || {}
    if (!id || (!name && typeof price === 'undefined')) {
      return errorResponse(res, 400, 'Missing id or fields to update')
    }
    const { anon, svc } = getClients()
    const base = svc || anon
    const { data, error } = await base.from('plans').update({ ...(name !== undefined ? { name } : {}), ...(price !== undefined ? { price } : {}) }).eq('id', id).select('id, name, max_files, max_charts, max_dashboards, price, created_at').single()
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

module.exports = router
