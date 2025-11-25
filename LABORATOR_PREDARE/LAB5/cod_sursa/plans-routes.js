const express = require('express')
const router = express.Router()
const { getAllPlans, getPlan } = require('../controllers/planController')

// Public routes (no authentication required)
router.get('/', getAllPlans)
router.get('/:id', getPlan)

module.exports = router
