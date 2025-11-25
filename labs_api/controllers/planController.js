const prisma = require('../config/prisma')

/**
 * GET /api/plans
 * Get all available plans
 */
const getAllPlans = async (req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        maxFiles: true,
        maxCharts: true,
        maxDashboards: true,
        price: true,
        createdAt: true
      }
    })

    // Transform to match frontend expectations (snake_case and numeric price)
    const transformedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      max_files: plan.maxFiles,
      max_charts: plan.maxCharts,
      max_dashboards: plan.maxDashboards,
      price: parseFloat(plan.price),
      created_at: plan.createdAt
    }))

    res.json(transformedPlans)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/plans/:id
 * Get single plan details
 */
const getPlan = async (req, res, next) => {
  try {
    const { id } = req.params

    const plan = await prisma.plan.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        maxFiles: true,
        maxCharts: true,
        maxDashboards: true,
        price: true,
        createdAt: true
      }
    })

    if (!plan) {
      return res.status(404).json({ 
        error: 'Plan not found' 
      })
    }

    // Transform to match frontend expectations (snake_case and numeric price)
    const transformedPlan = {
      id: plan.id,
      name: plan.name,
      max_files: plan.maxFiles,
      max_charts: plan.maxCharts,
      max_dashboards: plan.maxDashboards,
      price: parseFloat(plan.price),
      created_at: plan.createdAt
    }

    res.json(transformedPlan)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllPlans, getPlan }
