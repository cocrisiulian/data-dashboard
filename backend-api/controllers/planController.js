// LAB10: Service Layer & Dependency Injection
// Controllers now use Services instead of Prisma directly
const planService = require('../services/planService');
const prisma = require('../config/prisma');

/**
 * GET /api/plans
 * Get all available plans
 */
const getAllPlans = async (req, res, next) => {
  try {
    // Use Service Layer instead of Prisma
    const plans = await planService.getAllPlans();

    // Transform to match frontend expectations (snake_case and numeric price)
    const transformedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      max_files: plan.maxFiles,
      max_charts: plan.maxCharts,
      max_dashboards: plan.maxDashboards,
      price: parseFloat(plan.price),
      created_at: plan.createdAt
    }));

    res.json(transformedPlans);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/plans/:id
 * Get single plan details
 */
const getPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Use Service Layer
    const plan = await planService.getPlanById(id);

    if (!plan) {
      return res.status(404).json({
        error: 'Plan not found'
      });
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
    };

    res.json(transformedPlan);
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN CRUD OPERATIONS ====================

/**
 * POST /api/admin/plans
 * Create new plan (Admin only)
 */
const createPlan = async (req, res, next) => {
  try {
    const { name, price, maxFiles, maxCharts, maxDashboards } = req.body;

    // Validation
    if (!name || price === undefined) {
      return res.status(400).json({ 
        message: 'Name and price are required' 
      });
    }

    // Use service validation
    planService.validatePlanData({
      name,
      price,
      maxFiles,
      maxCharts,
      maxDashboards
    });

    // Create plan
    const newPlan = await prisma.plan.create({
      data: {
        name,
        price: parseFloat(price),
        maxFiles: maxFiles !== undefined ? parseInt(maxFiles) : 10,
        maxCharts: maxCharts !== undefined ? parseInt(maxCharts) : 5,
        maxDashboards: maxDashboards !== undefined ? parseInt(maxDashboards) : 2
      }
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'PLAN_CREATED_BY_ADMIN',
        entity: 'Plan',
        entityId: newPlan.id,
        metadata: { planName: newPlan.name }
      }
    });

    res.status(201).json(newPlan);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/plans/:id
 * Update existing plan (Admin only)
 */
const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, maxFiles, maxCharts, maxDashboards } = req.body;

    // Check plan exists
    const existingPlan = await prisma.plan.findUnique({
      where: { id }
    });

    if (!existingPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Build update data
    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (maxFiles !== undefined) updateData.maxFiles = parseInt(maxFiles);
    if (maxCharts !== undefined) updateData.maxCharts = parseInt(maxCharts);
    if (maxDashboards !== undefined) updateData.maxDashboards = parseInt(maxDashboards);

    // Validate
    planService.validatePlanData(updateData);

    // Update plan
    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: updateData
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'PLAN_UPDATED_BY_ADMIN',
        entity: 'Plan',
        entityId: updatedPlan.id,
        metadata: { planName: updatedPlan.name }
      }
    });

    res.json(updatedPlan);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/plans/:id
 * Delete plan (Admin only)
 * NOTE: Cannot delete if plan has users
 */
const deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check plan exists
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Business Rule: Cannot delete plan with users
    if (plan._count.users > 0) {
      return res.status(400).json({ 
        message: `Cannot delete plan. ${plan._count.users} user(s) are still using this plan.`,
        userCount: plan._count.users
      });
    }

    // Delete plan
    await prisma.plan.delete({
      where: { id }
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'PLAN_DELETED_BY_ADMIN',
        entity: 'Plan',
        entityId: id,
        metadata: { planName: plan.name }
      }
    });

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getAllPlans, 
  getPlan,
  createPlan,
  updatePlan,
  deletePlan
};
