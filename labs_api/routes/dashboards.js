const express = require('express')
const router = express.Router()
const { getClients, errorResponse } = require('../services/supabase')

// GET /labs/dashboards
router.get('/', async (req, res) => {
  try {
    const userId = req.header('x-user-id')
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')
    const { anon } = getClients()
    const { data, error } = await anon.from('dashboards').select('id, user_id, name, description, created_at, updated_at').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) return errorResponse(res, 500, 'Failed to fetch dashboards', error.message)
    res.json(data || [])
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// GET /labs/dashboards/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.header('x-user-id')
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')
    const { anon } = getClients()
    const { data, error } = await anon.from('dashboards').select('id, user_id, name, description, created_at, updated_at').eq('id', id).eq('user_id', userId).maybeSingle()
    if (error) return errorResponse(res, 500, 'Failed to fetch dashboard', error.message)
    if (!data) return errorResponse(res, 404, 'Dashboard not found')
    res.json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// POST /labs/dashboards
router.post('/', async (req, res) => {
  try {
    const userId = req.header('x-user-id')
    const { name, description } = req.body || {}
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')
    if (!name) return errorResponse(res, 400, 'Missing name')
    const { anon } = getClients()
    const { data, error } = await anon.from('dashboards').insert({ user_id: userId, name, description: description ?? null }).select('id, user_id, name, description, created_at, updated_at').single()
    if (error) return errorResponse(res, 500, 'Failed to create dashboard', error.message)
    res.status(201).json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

// PATCH /labs/dashboards/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.header('x-user-id')
    const { name, description } = req.body || {}
    if (!userId) return errorResponse(res, 401, 'Missing x-user-id header')
    const { anon } = getClients()
    const { data, error } = await anon.from('dashboards').update({ ...(name !== undefined ? { name } : {}), ...(description !== undefined ? { description } : {}) }).eq('id', id).eq('user_id', userId).select('id, user_id, name, description, created_at, updated_at').single()
    if (error) return errorResponse(res, 500, 'Failed to update dashboard', error.message)
    res.json(data)
  } catch (e) {
    errorResponse(res, 500, 'Unexpected error', String(e?.message || e))
  }
})

module.exports = router
