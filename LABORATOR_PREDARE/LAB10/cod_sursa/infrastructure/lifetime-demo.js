// Lab 10: Dependency Injection Lifetime Scopes Demo
// Demonstrates the differences between Singleton, Scoped, and Transient

const awilix = require('awilix');

// ========================================
// EXAMPLE CLASSES FOR DEMONSTRATION
// ========================================

/**
 * Simple counter class to track instances
 */
class Counter {
  static instanceCount = 0;
  
  constructor() {
    Counter.instanceCount++;
    this.id = Counter.instanceCount;
    this.createdAt = new Date();
    console.log(`[Counter] Instance #${this.id} created at ${this.createdAt.toISOString()}`);
  }
  
  getInfo() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      age: Date.now() - this.createdAt.getTime()
    };
  }
}

/**
 * Service that depends on Counter
 */
class DemoService {
  static instanceCount = 0;
  
  constructor(counter) {
    DemoService.instanceCount++;
    this.id = DemoService.instanceCount;
    this.counter = counter;
    this.createdAt = new Date();
    console.log(`[DemoService] Instance #${this.id} created with Counter #${counter.id}`);
  }
  
  getInfo() {
    return {
      serviceId: this.id,
      serviceCreatedAt: this.createdAt,
      counterInfo: this.counter.getInfo()
    };
  }
}

// ========================================
// LIFETIME SCOPE DEMONSTRATIONS
// ========================================

/**
 * Demo 1: SINGLETON Lifetime
 * One instance shared across entire application
 */
function demoSingleton() {
  console.log('\n========== SINGLETON DEMO ==========');
  
  const container = awilix.createContainer();
  
  container.register({
    counter: awilix.asClass(Counter).singleton()
  });
  
  // Resolve multiple times
  const counter1 = container.resolve('counter');
  console.log('First resolve:', counter1.getInfo());
  
  setTimeout(() => {
    const counter2 = container.resolve('counter');
    console.log('Second resolve:', counter2.getInfo());
    console.log('Are they the same?', counter1 === counter2); // true
  }, 100);
  
  /**
   * OUTPUT:
   * [Counter] Instance #1 created at ...
   * First resolve: { id: 1, createdAt: ..., age: 0 }
   * Second resolve: { id: 1, createdAt: ..., age: 100 }
   * Are they the same? true
   * 
   * EXPLANATION:
   * - Only ONE instance created
   * - Same instance returned every time
   * - Instance persists across entire app lifetime
   * 
   * USE CASES:
   * ✅ Configuration objects
   * ✅ Database connection pools
   * ✅ Caches
   * ✅ Loggers
   * ❌ Request-specific data
   * ❌ User sessions
   */
}

/**
 * Demo 2: SCOPED Lifetime
 * One instance per scope (e.g., per HTTP request)
 */
function demoScoped() {
  console.log('\n========== SCOPED DEMO ==========');
  
  const container = awilix.createContainer();
  
  container.register({
    counter: awilix.asClass(Counter).scoped()
  });
  
  // Create first scope (simulates first request)
  const scope1 = container.createScope();
  const counter1a = scope1.resolve('counter');
  const counter1b = scope1.resolve('counter');
  console.log('Scope 1, Resolve 1:', counter1a.getInfo());
  console.log('Scope 1, Resolve 2:', counter1b.getInfo());
  console.log('Same in scope 1?', counter1a === counter1b); // true
  
  // Create second scope (simulates second request)
  const scope2 = container.createScope();
  const counter2 = scope2.resolve('counter');
  console.log('Scope 2, Resolve 1:', counter2.getInfo());
  console.log('Same across scopes?', counter1a === counter2); // false
  
  // Cleanup
  scope1.dispose();
  scope2.dispose();
  
  /**
   * OUTPUT:
   * [Counter] Instance #1 created at ...
   * Scope 1, Resolve 1: { id: 1, ... }
   * Scope 1, Resolve 2: { id: 1, ... }
   * Same in scope 1? true
   * [Counter] Instance #2 created at ...
   * Scope 2, Resolve 1: { id: 2, ... }
   * Same across scopes? false
   * 
   * EXPLANATION:
   * - One instance per scope
   * - Same instance within a scope
   * - Different instances across scopes
   * - Disposed when scope ends
   * 
   * USE CASES:
   * ✅ Services with request context
   * ✅ Database transactions
   * ✅ Request-scoped caching
   * ✅ User authentication context
   * ❌ Heavy objects (creates many instances)
   * ❌ Shared state across requests
   */
}

/**
 * Demo 3: TRANSIENT Lifetime
 * New instance every time it's resolved
 */
function demoTransient() {
  console.log('\n========== TRANSIENT DEMO ==========');
  
  const container = awilix.createContainer();
  
  container.register({
    counter: awilix.asClass(Counter).transient()
  });
  
  // Resolve multiple times
  const counter1 = container.resolve('counter');
  const counter2 = container.resolve('counter');
  const counter3 = container.resolve('counter');
  
  console.log('First resolve:', counter1.getInfo());
  console.log('Second resolve:', counter2.getInfo());
  console.log('Third resolve:', counter3.getInfo());
  console.log('Are they the same?', counter1 === counter2); // false
  
  /**
   * OUTPUT:
   * [Counter] Instance #1 created at ...
   * First resolve: { id: 1, ... }
   * [Counter] Instance #2 created at ...
   * Second resolve: { id: 2, ... }
   * [Counter] Instance #3 created at ...
   * Third resolve: { id: 3, ... }
   * Are they the same? false
   * 
   * EXPLANATION:
   * - New instance EVERY time
   * - No sharing between resolves
   * - No caching
   * 
   * USE CASES:
   * ✅ Lightweight utilities
   * ✅ Disposable objects
   * ✅ Objects with no shared state
   * ✅ Command objects
   * ❌ Heavy objects (memory waste)
   * ❌ Database connections
   * ❌ Stateful services
   */
}

/**
 * Demo 4: Mixed Lifetimes
 * Shows how different lifetimes work together
 */
function demoMixedLifetimes() {
  console.log('\n========== MIXED LIFETIMES DEMO ==========');
  
  const container = awilix.createContainer();
  
  container.register({
    // Singleton counter - shared everywhere
    counter: awilix.asClass(Counter).singleton(),
    
    // Scoped service - new per scope, but uses singleton counter
    demoService: awilix.asClass(DemoService).scoped()
  });
  
  const scope1 = container.createScope();
  const scope2 = container.createScope();
  
  const service1 = scope1.resolve('demoService');
  const service2 = scope2.resolve('demoService');
  
  console.log('Service 1 info:', service1.getInfo());
  console.log('Service 2 info:', service2.getInfo());
  console.log('Services are different?', service1 !== service2); // true
  console.log('But counters are same?', service1.counter === service2.counter); // true
  
  scope1.dispose();
  scope2.dispose();
  
  /**
   * OUTPUT:
   * [Counter] Instance #1 created at ...
   * [DemoService] Instance #1 created with Counter #1
   * Service 1 info: { serviceId: 1, counterInfo: { id: 1, ... } }
   * [DemoService] Instance #2 created with Counter #1
   * Service 2 info: { serviceId: 2, counterInfo: { id: 1, ... } }
   * Services are different? true
   * But counters are same? true
   * 
   * EXPLANATION:
   * - SINGLETON counter shared across all scopes
   * - SCOPED service new per scope
   * - Dependencies can have different lifetimes
   */
}

/**
 * Demo 5: Performance Comparison
 */
async function demoPerformance() {
  console.log('\n========== PERFORMANCE DEMO ==========');
  
  const iterations = 10000;
  
  // SINGLETON
  const singletonContainer = awilix.createContainer();
  singletonContainer.register({
    counter: awilix.asClass(Counter).singleton()
  });
  
  console.time('Singleton');
  for (let i = 0; i < iterations; i++) {
    singletonContainer.resolve('counter');
  }
  console.timeEnd('Singleton');
  console.log('Singleton instances created:', 1);
  
  // SCOPED
  const scopedContainer = awilix.createContainer();
  scopedContainer.register({
    counter: awilix.asClass(Counter).scoped()
  });
  
  console.time('Scoped');
  for (let i = 0; i < iterations; i++) {
    const scope = scopedContainer.createScope();
    scope.resolve('counter');
    scope.dispose();
  }
  console.timeEnd('Scoped');
  console.log('Scoped instances created:', iterations);
  
  // TRANSIENT
  const transientContainer = awilix.createContainer();
  transientContainer.register({
    counter: awilix.asClass(Counter).transient()
  });
  
  console.time('Transient');
  for (let i = 0; i < iterations; i++) {
    transientContainer.resolve('counter');
  }
  console.timeEnd('Transient');
  console.log('Transient instances created:', iterations);
}

// ========================================
// COMPARISON TABLE
// ========================================

/**
 * LIFETIME SCOPE COMPARISON
 * 
 * ┌─────────────┬────────────────────┬──────────────────┬──────────────────┐
 * │  Aspect     │    SINGLETON       │     SCOPED       │    TRANSIENT     │
 * ├─────────────┼────────────────────┼──────────────────┼──────────────────┤
 * │ Instances   │ 1 per application  │ 1 per scope      │ 1 per resolve    │
 * │ Lifetime    │ Application        │ Scope (request)  │ Immediate        │
 * │ Memory      │ Low (1 instance)   │ Medium           │ High (many)      │
 * │ Performance │ Best               │ Good             │ Slower           │
 * │ Thread-safe │ Must be            │ Can be stateful  │ Stateless        │
 * │ Use Case    │ Shared resources   │ Request context  │ Utilities        │
 * └─────────────┴────────────────────┴──────────────────┴──────────────────┘
 */

// ========================================
// RUN DEMOS
// ========================================

function runAllDemos() {
  // Reset counters
  Counter.instanceCount = 0;
  DemoService.instanceCount = 0;
  
  demoSingleton();
  
  setTimeout(() => {
    Counter.instanceCount = 0;
    demoScoped();
  }, 200);
  
  setTimeout(() => {
    Counter.instanceCount = 0;
    demoTransient();
  }, 400);
  
  setTimeout(() => {
    Counter.instanceCount = 0;
    DemoService.instanceCount = 0;
    demoMixedLifetimes();
  }, 600);
  
  setTimeout(() => {
    Counter.instanceCount = 0;
    demoPerformance();
  }, 800);
}

module.exports = {
  demoSingleton,
  demoScoped,
  demoTransient,
  demoMixedLifetimes,
  demoPerformance,
  runAllDemos
};

// Uncomment to run
// if (require.main === module) {
//   runAllDemos();
// }
