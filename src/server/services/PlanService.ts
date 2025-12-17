/**
 * PlanService - Business Logic Layer
 * Locație: src/server/services/PlanService.ts
 * 
 * Folosit în:
 * - src/server/controllers/PlanController.ts (dependency injection)
 * - src/app/api/plans/route.ts (direct în Next.js API routes)
 * - LABORATOR_PREDARE/LAB10 (exemplu Service Layer Pattern)
 * 
 * Responsabilități:
 * - Business validation (duplicate names, positive limits, etc.)
 * - Business logic (calculateValueScore, upgradeRecommendations)
 * - Orchestrare între multiple repositories
 * - Business rules enforcement
 * - NO direct database access (folosește Repository)
 */

import { PlanRepository, PlanWithCount } from '../repositories/PlanRepository';
import { Plan } from '@prisma/client';
import { ICache } from '../infrastructure/cache/ICache';

export interface PlanDTO extends Plan {
  isPopular?: boolean;
  valueScore?: number;
  displayName?: string;
  canDelete?: boolean;
  upgradeRecommendation?: string | null;
  _count?: {
    users: number;
  };
}

export class PlanService {
  private planRepository: PlanRepository;
  private cacheManager: ICache;

  /**
   * Constructor cu Dependency Injection
   * @param planRepository - Injectat pentru testability și loose coupling
   * @param cacheManager - Cache service pentru performance optimization
   */
  constructor(planRepository: PlanRepository, cacheManager: ICache) {
    this.planRepository = planRepository;
    this.cacheManager = cacheManager;
  }

  /**
   * Get all plans cu business logic
   * Business Rule: Add computed fields (isPopular, valueScore)
   * Cache: plans-all pentru 1 oră (3600 seconds)
   * 
   * Folosit în: GET /api/plans
   */
  async getAllPlans(): Promise<PlanDTO[]> {
    const cacheKey = 'plans-all';
    
    // Try cache first
    if (this.cacheManager.isSet(cacheKey)) {
      const cachedPlans = this.cacheManager.get<PlanDTO[]>(cacheKey);
      if (cachedPlans) {
        return cachedPlans;
      }
    }
    
    // Get from database
    const plans = await this.planRepository.findAll();
    
    // Business logic: Add computed properties
    const plansWithMetadata = plans.map((plan: PlanWithCount) => ({
      ...plan,
      isPopular: (plan._count?.users || 0) > 10, // Business rule
      valueScore: this.calculateValueScore(plan), // Business calculation
      displayName: `${plan.name} Plan` // Business formatting
    }));
    
    // Store in cache
    this.cacheManager.set(cacheKey, plansWithMetadata);
    
    return plansWithMetadata;
  }

  /**
   * Get plan by ID cu validation
   * Business Rule: Validate plan exists
   * Cache: plan-{id} pentru 1 oră
   * 
   * Folosit în: GET /api/plans/:id
   */
  async getPlanById(planId: string): Promise<PlanDTO> {
    const cacheKey = `plan-${planId}`;
    
    // Try cache first
    if (this.cacheManager.isSet(cacheKey)) {
      const cachedPlan = this.cacheManager.get<PlanDTO>(cacheKey);
      if (cachedPlan) {
        return cachedPlan;
      }
    }
    
    // Get from database
    const plan = await this.planRepository.findById(planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Add business context
    const planWithMetadata = {
      ...plan,
      canDelete: (plan._count?.users || 0) === 0,
      upgradeRecommendation: this.getUpgradeRecommendation(plan)
    };
    
    // Store in cache
    this.cacheManager.set(cacheKey, planWithMetadata);
    
    return planWithMetadata;
  }

  /**
   * Create new plan cu business validation
   * Business Rules:
   * - Name must be unique
   * - Limits must be positive
   * - Price must be reasonable
   * 
   * Folosit în: POST /api/plans
   */
  async createPlan(planData: {
    name: string;
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
    price: number;
  }): Promise<Plan> {
    // Business validation
    this.validatePlanData(planData);
    
    // Check for duplicate names
    const existingPlan = await this.planRepository.findByName(planData.name);
    if (existingPlan) {
      throw new Error(`Plan with name '${planData.name}' already exists`);
    }

    // Business logic: Calculate recommended price
    const recommendedPrice = this.calculateRecommendedPrice(planData);
    
    if (planData.price && Math.abs(planData.price - recommendedPrice) > recommendedPrice * 0.5) {
      console.warn(`[BUSINESS WARNING] Price ${planData.price} differs from recommended ${recommendedPrice}`);
    }

    // Create plan
    const newPlan = await this.planRepository.create(planData);

    // Invalidate cache on mutation
    this.cacheManager.removeByPattern('plan');

    // Business event logging
    console.log(`[BUSINESS EVENT] Plan created: ${newPlan.name} (ID: ${newPlan.id})`);

    return newPlan;
  }

  /**
   * Update plan cu business validation
   * Business Rule: Cannot reduce limits if users would exceed
   * 
   * Folosit în: PUT /api/plans/:id
   */
  async updatePlan(planId: string, updateData: Partial<{
    name: string;
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
    price: number;
  }>): Promise<Plan> {
    const existingPlan = await this.planRepository.findById(planId);
    
    if (!existingPlan) {
      throw new Error('Plan not found');
    }

    // Business validation: Cannot reduce limits if affects users
    if (updateData.maxFiles && updateData.maxFiles < (existingPlan.maxFiles || 0)) {
      const affectedUsers = await this.planRepository.getUsersExceedingLimit(
        planId, 
        'files', 
        updateData.maxFiles
      );
      
      if (affectedUsers > 0) {
        throw new Error(
          `Cannot reduce maxFiles to ${updateData.maxFiles}. ${affectedUsers} user(s) would exceed limit.`
        );
      }
    }

    // Validate merged data
    if (updateData.name || updateData.maxFiles || updateData.maxCharts || updateData.maxDashboards) {
      this.validatePlanData({ ...existingPlan, ...updateData } as any);
    }

    const updatedPlan = await this.planRepository.update(planId, updateData);

    // Invalidate cache on mutation
    this.cacheManager.removeByPattern('plan');

    console.log(`[BUSINESS EVENT] Plan updated: ${updatedPlan.name}`);

    return updatedPlan;
  }

  /**
   * Delete plan cu business rules
   * Business Rule: Can only delete if no users subscribed
   * 
   * Folosit în: DELETE /api/plans/:id
   */
  async deletePlan(planId: string): Promise<void> {
    const plan = await this.planRepository.findById(planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Business rule: Cannot delete if users exist
    if ((plan._count?.users || 0) > 0) {
      throw new Error(
        `Cannot delete plan '${plan.name}'. ${plan._count?.users} user(s) subscribed. ` +
        `Migrate users to another plan first.`
      );
    }

    await this.planRepository.delete(planId);

    // Invalidate cache on mutation
    this.cacheManager.removeByPattern('plan');

    console.log(`[BUSINESS EVENT] Plan deleted: ${plan.name} (ID: ${planId})`);
  }

  // ========================================
  // PRIVATE BUSINESS LOGIC METHODS
  // ========================================

  /**
   * Calculate value score pentru plan
   * Business calculation: features / price ratio
   */
  private calculateValueScore(plan: PlanWithCount): number {
    const totalFeatures = (plan.maxFiles || 0) + (plan.maxCharts || 0) + (plan.maxDashboards || 0);
    const price = parseFloat(String(plan.price)) || 1;
    
    // Avoid division by zero
    return Math.round((totalFeatures / price) * 10) / 10;
  }

  /**
   * Get upgrade recommendation
   * Business logic: recommend upgrade based on usage
   */
  private getUpgradeRecommendation(plan: PlanWithCount): string | null {
    const userCount = plan._count?.users || 0;
    
    if (plan.name === 'Free' && userCount > 5) {
      return 'Consider upgrading to Pro for more features';
    }
    
    if (plan.name === 'Pro' && userCount > 20) {
      return 'Enterprise plan recommended for your user base';
    }
    
    return null;
  }

  /**
   * Calculate recommended price
   * Business formula: based on features
   */
  private calculateRecommendedPrice(planData: {
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
  }): number {
    const fileWeight = 0.1;
    const chartWeight = 0.05;
    const dashboardWeight = 0.5;
    
    return (
      (planData.maxFiles || 0) * fileWeight +
      (planData.maxCharts || 0) * chartWeight +
      (planData.maxDashboards || 0) * dashboardWeight
    );
  }

  /**
   * Validate plan data
   * Business validation rules
   */
  private validatePlanData(planData: {
    name: string;
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
    price?: number;
  }): void {
    if (!planData.name || planData.name.trim().length === 0) {
      throw new Error('Plan name is required');
    }

    if (planData.name.length > 50) {
      throw new Error('Plan name must be less than 50 characters');
    }

    if (planData.maxFiles < 0 || planData.maxCharts < 0 || planData.maxDashboards < 0) {
      throw new Error('Plan limits must be positive numbers');
    }

    if (planData.price && planData.price < 0) {
      throw new Error('Plan price must be positive');
    }

    if (planData.price && planData.price > 10000) {
      throw new Error('Plan price seems unreasonably high (max 10000)');
    }
  }
}

// Export singleton instance pentru production usage
import { planRepository } from '../repositories/PlanRepository';
import { MemoryCacheService } from '../infrastructure/cache/MemoryCacheService';

const cacheManager = new MemoryCacheService();
export const planService = new PlanService(planRepository, cacheManager);
