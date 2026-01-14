const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const {
  getAllDashboards,
  getDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  restoreDashboard,
  getTrash,
  permanentDeleteDashboard,
  getDashboardCharts,
  createDashboardChart,
  deleteDashboardChart
} = require('../controllers/dashboardController')

// All routes require authentication
router.use(authenticate)

/**
 * @swagger
 * /api/dashboards/trash:
 *   get:
 *     summary: Get all soft deleted dashboards
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted dashboards with metadata
 */
router.get('/trash', getTrash)

/**
 * @swagger
 * /api/dashboards:
 *   get:
 *     summary: Get all active dashboards
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's dashboards
 *   post:
 *     summary: Create new dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sales Analytics
 *               description:
 *                 type: string
 *                 example: Monthly sales performance dashboard
 *     responses:
 *       201:
 *         description: Dashboard created
 *       400:
 *         description: Plan limit reached
 */
router.get('/', getAllDashboards)

/**
 * @swagger
 * /api/dashboards/{id}:
 *   get:
 *     summary: Get dashboard by ID
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard details with charts
 *       404:
 *         description: Dashboard not found
 *   patch:
 *     summary: Update dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dashboard updated
 *   delete:
 *     summary: Soft delete dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard moved to trash
 */
router.get('/:id', getDashboard)
router.post('/', createDashboard)
router.patch('/:id', updateDashboard)
router.delete('/:id', deleteDashboard)

/**
 * @swagger
 * /api/dashboards/{id}/restore:
 *   post:
 *     summary: Restore soft deleted dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard restored
 *       400:
 *         description: Cannot restore (expired or limits)
 */
router.post('/:id/restore', restoreDashboard)

/**
 * @swagger
 * /api/dashboards/{id}/permanent:
 *   delete:
 *     summary: Permanently delete dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard permanently deleted
 */
router.delete('/:id/permanent', permanentDeleteDashboard)

/**
 * @swagger
 * /api/dashboards/{id}/charts:
 *   get:
 *     summary: Get all charts in dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of dashboard charts
 *   post:
 *     summary: Create chart in dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - fileId
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [bar, line, pie, scatter]
 *                 example: bar
 *               fileId:
 *                 type: string
 *               config:
 *                 type: object
 *     responses:
 *       201:
 *         description: Chart created
 */
router.get('/:id/charts', getDashboardCharts)
router.post('/:id/charts', createDashboardChart)

/**
 * @swagger
 * /api/dashboards/{id}/charts/{chartId}:
 *   delete:
 *     summary: Delete chart from dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: chartId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chart deleted
 */
router.delete('/:id/charts/:chartId', deleteDashboardChart)

module.exports = router
