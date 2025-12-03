// Lab 10: Controller using Dependency Injection
// Refactored controller that receives dependencies via constructor

/**
 * PlanController - Presentation Layer
 * 
 * Responsibilities:
 * - HTTP request/response handling
 * - Request validation (basic)
 * - Delegating to service layer
 * - Response formatting
 * - Error handling
 * 
 * NO business logic here - all in PlanService!
 */
class PlanController {
  /**
   * Constructor with Dependency Injection
   * Dependencies are injected by the DI container
   * 
   * @param {PlanService} planService - Injected business service
   */
  constructor(planService) {
    this.planService = planService;
  }

  /**
   * GET /api/plans
   * Get all plans
   */
  async getAllPlans(req, res) {
    try {
      const plans = await this.planService.getAllPlans();
      
      res.json({
        success: true,
        count: plans.length,
        data: plans
      });
    } catch (error) {
      console.error('Error in getAllPlans:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching plans',
        error: error.message
      });
    }
  }

  /**
   * GET /api/plans/:id
   * Get plan by ID
   */
  async getPlanById(req, res) {
    try {
      const { id } = req.params;
      
      const plan = await this.planService.getPlanById(id);
      
      res.json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error('Error in getPlanById:', error);
      
      if (error.message === 'Plan not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error fetching plan',
        error: error.message
      });
    }
  }

  /**
   * POST /api/plans
   * Create new plan
   */
  async createPlan(req, res) {
    try {
      const planData = req.body;
      
      // Basic validation (detailed validation in service)
      if (!planData.name || !planData.maxFiles || !planData.maxCharts || !planData.maxDashboards) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      const newPlan = await this.planService.createPlan(planData);
      
      res.status(201).json({
        success: true,
        message: 'Plan created successfully',
        data: newPlan
      });
    } catch (error) {
      console.error('Error in createPlan:', error);
      
      // Handle business logic errors
      if (error.message.includes('already exists') || error.message.includes('must be')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error creating plan',
        error: error.message
      });
    }
  }

  /**
   * PATCH /api/plans/:id
   * Update plan
   */
  async updatePlan(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedPlan = await this.planService.updatePlan(id, updateData);
      
      res.json({
        success: true,
        message: 'Plan updated successfully',
        data: updatedPlan
      });
    } catch (error) {
      console.error('Error in updatePlan:', error);
      
      if (error.message === 'Plan not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('Cannot reduce') || error.message.includes('would exceed')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error updating plan',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/plans/:id
   * Delete plan
   */
  async deletePlan(req, res) {
    try {
      const { id } = req.params;
      
      const result = await this.planService.deletePlan(id);
      
      res.json(result);
    } catch (error) {
      console.error('Error in deletePlan:', error);
      
      if (error.message === 'Plan not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('Cannot delete')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting plan',
        error: error.message
      });
    }
  }

  /**
   * GET /api/plans/:id/statistics
   * Get plan statistics
   */
  async getPlanStatistics(req, res) {
    try {
      const { id } = req.params;
      
      const stats = await this.planService.getPlanStatistics(id);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getPlanStatistics:', error);
      
      if (error.message === 'Plan not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }

  /**
   * POST /api/plans/compare
   * Compare multiple plans
   */
  async comparePlans(req, res) {
    try {
      const { planIds } = req.body;
      
      if (!Array.isArray(planIds) || planIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'planIds array is required'
        });
      }
      
      const comparison = await this.planService.comparePlans(planIds);
      
      res.json({
        success: true,
        count: comparison.length,
        data: comparison
      });
    } catch (error) {
      console.error('Error in comparePlans:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error comparing plans',
        error: error.message
      });
    }
  }
}

/**
 * BEFORE DI (Old way - tightly coupled):
 * 
 * const prisma = require('../config/prisma');
 * 
 * exports.getAllPlans = async (req, res) => {
 *   const plans = await prisma.plan.findMany(...);
 *   // Business logic mixed with data access
 *   // Hard to test, hard to change
 *   res.json(plans);
 * };
 */

/**
 * AFTER DI (New way - loosely coupled):
 * 
 * class PlanController {
 *   constructor(planService) {
 *     this.planService = planService; // Injected!
 *   }
 * 
 *   async getAllPlans(req, res) {
 *     const plans = await this.planService.getAllPlans();
 *     res.json(plans);
 *   }
 * }
 * 
 * Benefits:
 * - Easy to test (mock planService)
 * - Separation of concerns
 * - Flexible (swap implementations)
 * - Clear dependencies
 */

module.exports = PlanController;
