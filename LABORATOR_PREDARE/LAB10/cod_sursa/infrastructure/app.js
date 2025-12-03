// Lab 10: Application Setup with Dependency Injection
// Complete Express.js setup with DI container

const express = require('express');
const { createContainer, createScopePerRequest } = require('./infrastructure/container');
const { createPlanRouter } = require('./routes/plans-with-di');

/**
 * Bootstrap the Express application with DI
 */
function createApp() {
  const app = express();

  // ========================================
  // MIDDLEWARE
  // ========================================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ========================================
  // DEPENDENCY INJECTION SETUP
  // ========================================
  
  // 1. Create the DI container
  const container = createContainer();
  
  // 2. Add middleware to create scoped container per request
  app.use(createScopePerRequest(container));
  
  // 3. Attach container to app for access in routes
  app.set('container', container);

  // ========================================
  // ROUTES WITH DI
  // ========================================
  
  app.use('/api/plans', createPlanRouter(container));
  
  // Add more routes as needed
  // app.use('/api/users', createUserRouter(container));
  // app.use('/api/files', createFileRouter(container));

  // ========================================
  // ERROR HANDLING
  // ========================================
  
  app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // ========================================
  // CLEANUP ON SHUTDOWN
  // ========================================
  
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, disposing container...');
    await container.dispose();
    process.exit(0);
  });

  return app;
}

/**
 * Start the server
 */
function startServer(port = 3001) {
  const app = createApp();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Dependency Injection container initialized`);
  });
  
  return app;
}

// ========================================
// USAGE EXAMPLES
// ========================================

/**
 * Example 1: Basic startup
 * 
 * const app = startServer(3001);
 */

/**
 * Example 2: Testing setup
 * 
 * const app = createApp();
 * const request = require('supertest');
 * 
 * describe('Plans API', () => {
 *   it('should get all plans', async () => {
 *     const response = await request(app).get('/api/plans');
 *     expect(response.status).toBe(200);
 *   });
 * });
 */

/**
 * Example 3: Manual container access
 * 
 * const app = createApp();
 * const container = app.get('container');
 * 
 * // Resolve any dependency
 * const planService = container.resolve('planService');
 * const plans = await planService.getAllPlans();
 */

module.exports = {
  createApp,
  startServer
};

// Uncomment to run directly
// if (require.main === module) {
//   startServer(3001);
// }
