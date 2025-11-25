const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const {
  getAllDashboards,
  getDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getDashboardCharts,
  createDashboardChart,
  deleteDashboardChart
} = require('../controllers/dashboardController')

// All routes require authentication
router.use(authenticate)

// Parent resource routes
router.get('/', getAllDashboards)
router.get('/:id', getDashboard)
router.post('/', createDashboard)
router.patch('/:id', updateDashboard)
router.delete('/:id', deleteDashboard)

// Nested resource routes (Lab 6 - Advanced MVC)
router.get('/:id/charts', getDashboardCharts)
router.post('/:id/charts', createDashboardChart)
router.delete('/:id/charts/:chartId', deleteDashboardChart)

module.exports = router
