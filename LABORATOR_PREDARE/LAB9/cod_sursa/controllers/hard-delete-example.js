// Lab 9: Hard Delete Controller Implementation
// Example: Plans Controller with Hard Delete

const prisma = require('../../config/prisma');

// =====================================================
// HARD DELETE IMPLEMENTATION
// =====================================================

/**
 * Get all plans
 * GET /api/plans
 */
exports.getAllPlans = async (req, res) => {
  try {
    // 📌 NO SOFT DELETE FILTER: Plans don't use soft delete
    const plans = await prisma.plan.findMany({
      orderBy: {
        price: 'asc'
      },
      include: {
        _count: {
          select: {
            users: true  // Count active users on this plan
          }
        }
      }
    });

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plans'
    });
  }
};

/**
 * Get plan by ID
 * GET /api/plans/:id
 */
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plan'
    });
  }
};

/**
 * Create a new plan
 * POST /api/plans
 */
exports.createPlan = async (req, res) => {
  try {
    const { name, maxFiles, maxCharts, maxDashboards, price } = req.body;

    // Validation
    if (!name || !maxFiles || !maxCharts || !maxDashboards) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const newPlan = await prisma.plan.create({
      data: {
        name,
        maxFiles: parseInt(maxFiles),
        maxCharts: parseInt(maxCharts),
        maxDashboards: parseInt(maxDashboards),
        price: parseFloat(price || 0)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: newPlan
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Plan with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating plan'
    });
  }
};

/**
 * Update a plan
 * PATCH /api/plans/:id
 */
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maxFiles, maxCharts, maxDashboards, price } = req.body;

    // Check if plan exists
    const existingPlan = await prisma.plan.findUnique({
      where: { id: id }
    });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (maxFiles !== undefined) updateData.maxFiles = parseInt(maxFiles);
    if (maxCharts !== undefined) updateData.maxCharts = parseInt(maxCharts);
    if (maxDashboards !== undefined) updateData.maxDashboards = parseInt(maxDashboards);
    if (price !== undefined) updateData.price = parseFloat(price);

    const updatedPlan = await prisma.plan.update({
      where: { id: id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: updatedPlan
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating plan'
    });
  }
};

/**
 * Hard delete a plan (with validation)
 * DELETE /api/plans/:id
 */
exports.hardDeletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // ⚠️ VALIDATION: Prevent deletion if users are using this plan
    if (plan._count.users > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete plan. ${plan._count.users} user(s) are currently using this plan.`,
        conflict: {
          reason: 'users_exist',
          userCount: plan._count.users
        }
      });
    }

    // ✅ HARD DELETE: Permanently remove from database
    await prisma.plan.delete({
      where: { id: id }
    });

    res.json({
      success: true,
      message: 'Plan permanently deleted',
      data: {
        id: plan.id,
        name: plan.name,
        deletedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error hard deleting plan:', error);

    // Handle foreign key constraint violation
    if (error.code === 'P2003') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete plan due to existing references'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting plan'
    });
  }
};

/**
 * Force delete a plan (cascade delete users - DANGEROUS!)
 * DELETE /api/plans/:id/force
 */
exports.forceDeletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmDeletion } = req.body;

    // Require explicit confirmation
    if (confirmDeletion !== 'DELETE_ALL_USERS') {
      return res.status(400).json({
        success: false,
        message: 'Confirmation required. Set confirmDeletion to "DELETE_ALL_USERS"'
      });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: id },
      include: {
        _count: { select: { users: true } }
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // ⚠️ CASCADE DELETE: First update users to NULL plan, then delete plan
    await prisma.$transaction(async (tx) => {
      // Set all users' planId to null
      await tx.user.updateMany({
        where: { planId: id },
        data: { planId: null }
      });

      // Then delete the plan
      await tx.plan.delete({
        where: { id: id }
      });
    });

    res.json({
      success: true,
      message: `Plan force deleted. ${plan._count.users} users set to no plan.`,
      data: {
        deletedPlanId: id,
        affectedUsers: plan._count.users
      }
    });
  } catch (error) {
    console.error('Error force deleting plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error force deleting plan'
    });
  }
};

// =====================================================
// HARD DELETE: Charts Controller Example
// =====================================================

/**
 * Hard delete a chart
 * DELETE /api/charts/:id
 */
exports.hardDeleteChart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership through dashboard
    const chart = await prisma.chart.findFirst({
      where: {
        id: id,
        dashboard: {
          userId: userId
        }
      },
      include: {
        dashboard: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: 'Chart not found or access denied'
      });
    }

    // ✅ HARD DELETE: Charts are leaf entities, safe to delete
    await prisma.chart.delete({
      where: { id: id }
    });

    res.json({
      success: true,
      message: 'Chart permanently deleted',
      data: {
        id: chart.id,
        title: chart.title,
        deletedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error hard deleting chart:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chart'
    });
  }
};

/**
 * Bulk hard delete charts
 * POST /api/charts/bulk-delete
 */
exports.bulkHardDeleteCharts = async (req, res) => {
  try {
    const { chartIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(chartIds) || chartIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Chart IDs array is required'
      });
    }

    // Verify all charts belong to user's dashboards
    const userCharts = await prisma.chart.findMany({
      where: {
        id: { in: chartIds },
        dashboard: {
          userId: userId
        }
      },
      select: { id: true }
    });

    if (userCharts.length !== chartIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Some charts do not belong to you'
      });
    }

    // Hard delete all charts
    const result = await prisma.chart.deleteMany({
      where: {
        id: { in: chartIds }
      }
    });

    res.json({
      success: true,
      message: `${result.count} charts permanently deleted`,
      count: result.count
    });
  } catch (error) {
    console.error('Error bulk deleting charts:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting charts'
    });
  }
};

module.exports = exports;
