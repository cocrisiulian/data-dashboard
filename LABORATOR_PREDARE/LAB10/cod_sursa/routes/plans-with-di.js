// Lab 10: Express Router with Dependency Injection
// Shows how to wire up DI container with Express routes

const express = require('express');

/**
 * Create Express router with DI-powered controllers
 * 
 * @param {Container} container - Awilix DI container
 * @returns {Router} Express router
 */
function createPlanRouter(container) {
  const router = express.Router();

  /**
   * Helper function to wrap controller methods
   * Resolves the controller from the scoped container
   */
  const controllerAction = (controllerName, methodName) => {
    return async (req, res, next) => {
      try {
        // Resolve controller from request scope
        const controller = req.scope.resolve(controllerName);
        
        // Call the controller method
        await controller[methodName](req, res);
      } catch (error) {
        next(error);
      }
    };
  };

  // ========================================
  // ROUTES WITH DI
  // ========================================

  // GET /api/plans - Get all plans
  router.get('/', controllerAction('planController', 'getAllPlans'));

  // GET /api/plans/:id - Get plan by ID
  router.get('/:id', controllerAction('planController', 'getPlanById'));

  // POST /api/plans - Create new plan
  router.post('/', controllerAction('planController', 'createPlan'));

  // PATCH /api/plans/:id - Update plan
  router.patch('/:id', controllerAction('planController', 'updatePlan'));

  // DELETE /api/plans/:id - Delete plan
  router.delete('/:id', controllerAction('planController', 'deletePlan'));

  // GET /api/plans/:id/statistics - Get plan statistics
  router.get('/:id/statistics', controllerAction('planController', 'getPlanStatistics'));

  // POST /api/plans/compare - Compare multiple plans
  router.post('/compare', controllerAction('planController', 'comparePlans'));

  return router;
}

/**
 * ALTERNATIVE: Manual controller instantiation (not recommended)
 * Shows the old way vs new way
 */
function createPlanRouterWithoutDI() {
  const router = express.Router();
  
  // ❌ OLD WAY: Manual instantiation
  const PlanRepository = require('../repositories/PlanRepository');
  const PlanService = require('../services/PlanService');
  const PlanController = require('../controllers/PlanController');
  
  const planRepository = new PlanRepository();
  const planService = new PlanService(planRepository);
  const planController = new PlanController(planService);
  
  router.get('/', (req, res) => planController.getAllPlans(req, res));
  router.get('/:id', (req, res) => planController.getPlanById(req, res));
  
  // Problems:
  // - Manual dependency management
  // - No lifetime control
  // - Hard to test
  // - Tightly coupled
  
  return router;
}

module.exports = {
  createPlanRouter,
  createPlanRouterWithoutDI
};
