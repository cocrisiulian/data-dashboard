const express = require('express')
const router = express.Router()
const { getAllPlans, getPlan } = require('../controllers/planController')

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of all plans with user counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                     example: Pro Plan
 *                   price:
 *                     type: number
 *                     example: 19.99
 *                   maxFiles:
 *                     type: integer
 *                     example: 100
 *                   maxCharts:
 *                     type: integer
 *                     example: 50
 *                   maxDashboards:
 *                     type: integer
 *                     example: 10
 *                   isPopular:
 *                     type: boolean
 *                     description: True if more than 5 users
 */
router.get('/', getAllPlans)

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan details
 *       404:
 *         description: Plan not found
 */
router.get('/:id', getPlan)

module.exports = router
