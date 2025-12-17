/**
 * Dependency Injection Container cu Awilix
 * Locație: src/server/infrastructure/container.ts
 * 
 * Folosit în:
 * - src/app/api/plans/route.ts (pentru Next.js API routes)
 * - labs_api/server.js (pentru Express standalone)
 * - LABORATOR_PREDARE/LAB10 (exemplu DI Pattern)
 * 
 * Responsabilități:
 * - Centralized dependency configuration
 * - Lifecycle management (SINGLETON, SCOPED, TRANSIENT)
 * - Automatic dependency resolution
 * - Testability (easy mocking pentru unit tests)
 */

import { createContainer, asClass, InjectionMode, AwilixContainer } from 'awilix';

// Services
import { PlanService } from '../services/PlanService';
import { FileService } from '../services/FileService';
import { ChartService } from '../services/ChartService';
import { DashboardService } from '../services/DashboardService';

// Repositories
import { PlanRepository } from '../repositories/PlanRepository';
import { FileRepository } from '../repositories/FileRepository';
import { ChartRepository } from '../repositories/ChartRepository';
import { DashboardRepository } from '../repositories/DashboardRepository';
import { UserRepository } from '../repositories/UserRepository';

// Controllers
import { PlanController } from '../controllers/PlanController';
import { FileController } from '../controllers/FileController';
import { ChartController } from '../controllers/ChartController';
import { DashboardController } from '../controllers/DashboardController';

// Infrastructure
import { MemoryCacheService } from './cache/MemoryCacheService';
import { ICache } from './cache/ICache';

/**
 * Create și configure DI container
 *
 * Lifetime Scopes:
 * - SINGLETON: O instanță pentru toată aplicația (shared state)
 * - SCOPED: O instanță per HTTP request (request context)
 * - TRANSIENT: Instanță nouă la fiecare injection (no state)
 */
export function createDIContainer(): AwilixContainer {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
  });

  // ========================================
  // REPOSITORIES (SINGLETON)
  // ========================================
  // Repositories sunt stateless, deci singleton e safe
  // O singură instanță pentru toată aplicația

  container.register({
    planRepository: asClass(PlanRepository).singleton(),
    fileRepository: asClass(FileRepository).singleton(),
    chartRepository: asClass(ChartRepository).singleton(),
    dashboardRepository: asClass(DashboardRepository).singleton(),
    userRepository: asClass(UserRepository).singleton()
  });

  // ========================================
  // INFRASTRUCTURE (SINGLETON)
  // ========================================
  // Cache service - singleton pentru shared cache între toate requesturile

  container.register({
    cacheManager: asClass(MemoryCacheService).singleton()
  });

  // ========================================
  // SERVICES (SINGLETON)
  // ========================================
  // Services sunt singleton pentru performance
  // Stateless business logic

  container.register({
    planService: asClass(PlanService).singleton(),
    fileService: asClass(FileService).singleton(),
    chartService: asClass(ChartService).singleton(),
    dashboardService: asClass(DashboardService).singleton()
  });

  // ========================================
  // CONTROLLERS (SCOPED)
  // ========================================
  // Controllers sunt scoped la request
  // pentru a menține request context

  container.register({
    planController: asClass(PlanController).scoped(),
    fileController: asClass(FileController).scoped(),
    chartController: asClass(ChartController).scoped(),
    dashboardController: asClass(DashboardController).scoped()
  });

  return container;
}

/**
 * Global container instance
 * Export pentru folosire în API routes
 */
export const container = createDIContainer();

/**
 * Helper: Resolve dependency din container
 * 
 * Exemplu folosire în Next.js API route:
 * 
 * import { resolveDependency } from '@/server/infrastructure/container';
 * import { PlanController } from '@/server/controllers/PlanController';
 * 
 * export async function GET() {
 *   const planController = resolveDependency<PlanController>('planController');
 *   const response = await planController.getAllPlans();
 *   return PlanController.toNextResponse(response);
 * }
 */
export function resolveDependency<T>(name: string): T {
  return container.resolve<T>(name);
}

/**
 * Helper: Create scoped container pentru request
 * Folosit în Express middleware pentru request-scoped dependencies
 * 
 * Exemplu în Express:
 * 
 * app.use((req, res, next) => {
 *   req.container = createScopedContainer();
 *   next();
 * });
 */
export function createScopedContainer(): AwilixContainer {
  return container.createScope();
}

/**
 * Cleanup container
 * Folosit la shutdown pentru graceful cleanup
 */
export async function disposeContainer(): Promise<void> {
  await container.dispose();
}

/**
 * Register custom dependency
 * Folosit pentru testing sau custom services
 * 
 * Exemplu:
 * registerDependency('mockPlanRepository', MockPlanRepository, 'singleton');
 */
export function registerDependency(
  name: string,
  implementation: any,
  lifetime: 'singleton' | 'scoped' | 'transient' = 'singleton'
): void {
  const registration = asClass(implementation);

  switch (lifetime) {
    case 'singleton':
      container.register({ [name]: registration.singleton() });
      break;
    case 'scoped':
      container.register({ [name]: registration.scoped() });
      break;
    case 'transient':
      container.register({ [name]: registration.transient() });
      break;
  }
}

/**
 * Exemplu folosire în test:
 * 
 * import { createDIContainer, registerDependency } from '@/server/infrastructure/container';
 * 
 * describe('PlanService', () => {
 *   let container: AwilixContainer;
 *   
 *   beforeEach(() => {
 *     container = createDIContainer();
 *     registerDependency('planRepository', MockPlanRepository, 'singleton');
 *   });
 *   
 *   it('should get all plans', async () => {
 *     const planService = container.resolve<PlanService>('planService');
 *     const plans = await planService.getAllPlans();
 *     expect(plans).toHaveLength(3);
 *   });
 * });
 */
