const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/charts?dashboardId=xxx - Get all charts for a dashboard
router.get('/', chartController.getAllCharts);

// GET /api/charts/:id - Get single chart
router.get('/:id', chartController.getChart);

// POST /api/charts - Create new chart
router.post('/', chartController.createChart);

// PATCH /api/charts/:id - Update chart
router.patch('/:id', chartController.updateChart);

// DELETE /api/charts/:id - Delete chart
router.delete('/:id', chartController.deleteChart);

module.exports = router;
