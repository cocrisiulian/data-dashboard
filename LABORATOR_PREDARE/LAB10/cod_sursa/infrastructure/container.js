// Lab 10: Dependency Injection Container using Awilix
// Centralized DI configuration for the application

const awilix = require('awilix');

// Services
const PlanService = require('../services/PlanService');
const UserService = require('../services/UserService');
const FileService = require('../services/FileService');

// Repositories
const PlanRepository = require('../repositories/PlanRepository');
const UserRepository = require('../repositories/UserRepository');
const FileRepository = require('../repositories/FileRepository');

// Controllers (if needed)
const PlanController = require('../controllers/PlanController');

/**
 * Create and configure the DI container
 * 
 * Lifetime Scopes:
 * - SINGLETON: One instance for the entire application
 * - SCOPED: One instance per HTTP request
 * - TRANSIENT: New instance every time it's injected
 */
function createContainer() {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
  });

  // ========================================
  // REGISTER REPOSITORIES (SINGLETON)
  // ========================================
  // Repositories are typically singletons as they're stateless
  // and just provide data access methods
  
  container.register({
    planRepository: awilix.asClass(PlanRepository).singleton(),
    userRepository: awilix.asClass(UserRepository).singleton(),
    fileRepository: awilix.asClass(FileRepository).singleton()
  });

  // ========================================
  // REGISTER SERVICES (SCOPED)
  // ========================================
  // Services are scoped to the request to maintain request context
  // and ensure proper cleanup after request completes
  
  container.register({
    planService: awilix.asClass(PlanService).scoped(),
    userService: awilix.asClass(UserService).scoped(),
    fileService: awilix.asClass(FileService).scoped()
  });

  // ========================================
  // REGISTER CONTROLLERS (SCOPED)
  // ========================================
  // Controllers are scoped per request
  
  container.register({
    planController: awilix.asClass(PlanController).scoped()
  });

  return container;
}

/**
 * Alternative configuration showing different lifetime scopes
 */
function createContainerWithVariousLifetimes() {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC
  });

  // EXAMPLE 1: SINGLETON - Shared across entire application
  container.register({
    planRepository: awilix.asClass(PlanRepository).singleton()
    // ✅ Good for: Stateless services, configuration, caches
    // ❌ Avoid for: Request-specific data, user sessions
  });

  // EXAMPLE 2: SCOPED - New instance per request
  container.register({
    planService: awilix.asClass(PlanService).scoped()
    // ✅ Good for: Services that need request context, transactions
    // ❌ Avoid for: Heavy objects that don't need request isolation
  });

  // EXAMPLE 3: TRANSIENT - New instance every time
  container.register({
    logger: awilix.asFunction(() => {
      return {
        log: (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)
      };
    }).transient()
    // ✅ Good for: Lightweight utilities, disposable objects
    // ❌ Avoid for: Heavy objects, database connections
  });

  return container;
}

/**
 * Express middleware to create a scoped container per request
 * This ensures each request gets its own scope for SCOPED dependencies
 */
function createScopePerRequest(container) {
  return (req, res, next) => {
    // Create a scoped container for this request
    req.scope = container.createScope();
    
    // Cleanup after response is sent
    res.on('finish', () => {
      req.scope.dispose();
    });
    
    next();
  };
}

/**
 * Helper to resolve dependencies manually
 * Useful for testing or when not using middleware
 */
function resolveDependency(container, name) {
  return container.resolve(name);
}

// ========================================
// USAGE EXAMPLES
// ========================================

/**
 * Example 1: Basic usage in Express
 * 
 * const container = createContainer();
 * app.use(createScopePerRequest(container));
 * 
 * // In route handler:
 * app.get('/api/plans', (req, res) => {
 *   const planService = req.scope.resolve('planService');
 *   const plans = await planService.getAllPlans();
 *   res.json(plans);
 * });
 */

/**
 * Example 2: Testing with mocked dependencies
 * 
 * const testContainer = createContainer();
 * 
 * // Override repository with mock
 * testContainer.register({
 *   planRepository: awilix.asValue({
 *     findAll: async () => [{ id: '1', name: 'Test Plan' }]
 *   })
 * });
 * 
 * const planService = testContainer.resolve('planService');
 * const plans = await planService.getAllPlans();
 */

/**
 * Example 3: Lifetime comparison
 * 
 * // SINGLETON - Same instance everywhere
 * const repo1 = container.resolve('planRepository');
 * const repo2 = container.resolve('planRepository');
 * console.log(repo1 === repo2); // true
 * 
 * // SCOPED - Different instances in different scopes
 * const scope1 = container.createScope();
 * const scope2 = container.createScope();
 * const service1 = scope1.resolve('planService');
 * const service2 = scope2.resolve('planService');
 * console.log(service1 === service2); // false
 * 
 * // TRANSIENT - Different instances always
 * const logger1 = container.resolve('logger');
 * const logger2 = container.resolve('logger');
 * console.log(logger1 === logger2); // false
 */

module.exports = {
  createContainer,
  createContainerWithVariousLifetimes,
  createScopePerRequest,
  resolveDependency
};
