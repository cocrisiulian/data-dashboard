const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { checkAdmin } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const planController = require('../controllers/planController');

// All admin routes require authentication AND admin privileges
router.use(authenticate);
router.use(checkAdmin);

// ==================== USER MANAGEMENT ====================

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users with plan info
 *       403:
 *         description: Admin access required
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get single user details (Admin only)
 *     tags: [Admin - Users]
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
 *         description: User details with files and dashboards
 *       404:
 *         description: User not found
 */
router.get('/users/:id', adminController.getUser);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create new user (Admin only)
 *     tags: [Admin - Users]
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
 *               - email
 *               - password
 *               - planId
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               planId:
 *                 type: integer
 *                 example: 1
 *               isAdmin:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or email exists
 */
router.post('/users', adminController.createUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Update user (Admin only)
 *     tags: [Admin - Users]
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
 *               email:
 *                 type: string
 *               planId:
 *                 type: integer
 *               isAdmin:
 *                 type: boolean
 *               password:
 *                 type: string
 *                 description: New password (optional)
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.patch('/users/:id', adminController.updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only, soft delete)
 *     tags: [Admin - Users]
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
 *         description: User deleted successfully
 *       403:
 *         description: Cannot delete own account
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', adminController.deleteUser);

// ==================== PLAN MANAGEMENT ====================

/**
 * @swagger
 * /api/admin/plans:
 *   post:
 *     summary: Create new plan (Admin only)
 *     tags: [Admin - Plans]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Plan
 *               price:
 *                 type: number
 *                 example: 29.99
 *               maxFiles:
 *                 type: integer
 *                 example: 200
 *               maxCharts:
 *                 type: integer
 *                 example: 100
 *               maxDashboards:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Plan created successfully
 */
router.post('/plans', planController.createPlan);

/**
 * @swagger
 * /api/admin/plans/{id}:
 *   patch:
 *     summary: Update plan (Admin only)
 *     tags: [Admin - Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               maxFiles:
 *                 type: integer
 *               maxCharts:
 *                 type: integer
 *               maxDashboards:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Plan updated successfully
 */
router.patch('/plans/:id', planController.updatePlan);

/**
 * @swagger
 * /api/admin/plans/{id}:
 *   delete:
 *     summary: Delete plan (Admin only)
 *     description: Cannot delete if plan has users
 *     tags: [Admin - Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       400:
 *         description: Plan has users, cannot delete
 */
router.delete('/plans/:id', planController.deletePlan);

// ==================== ACTIVITY LOGS ====================

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get activity logs (Admin only)
 *     tags: [Admin - Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Filter by entity type (File, Dashboard, etc.)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of logs per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Activity logs with pagination
 */
router.get('/logs', adminController.getActivityLogs);

// ==================== STATISTICS ====================

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics (Admin only)
 *     tags: [Admin - Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 activeUsers:
 *                   type: integer
 *                 totalFiles:
 *                   type: integer
 *                 totalDashboards:
 *                   type: integer
 *                 planDistribution:
 *                   type: array
 *                 recentActivity:
 *                   type: array
 */
router.get('/stats', adminController.getStatistics);

module.exports = router;
