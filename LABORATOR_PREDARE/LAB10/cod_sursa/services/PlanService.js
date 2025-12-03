// Lab 10: Business Layer - Plan Service
// Service layer that encapsulates business logic for Plans

/**
 * PlanService - Business Logic Layer for Plans
 * 
 * Responsibilities:
 * - Business validation
 * - Complex calculations
 * - Orchestration between multiple repositories
 * - Business rules enforcement
 */
class PlanService {
  /**
   * Constructor with Dependency Injection
   * @param {Object} planRepository - Injected repository for data access
   */
  constructor(planRepository) {
    this.planRepository = planRepository;
  }

  /**
   * Get all plans with business logic
   * Business Rule: Add computed fields like usage percentage
   */
  async getAllPlans() {
    const plans = await this.planRepository.findAll();
    
    // Business logic: Add computed properties
    return plans.map(plan => ({
      ...plan,
      isPopular: plan._count?.users > 10, // Business rule
      valueScore: this.calculateValueScore(plan), // Business calculation
      displayName: `${plan.name} Plan` // Business formatting
    }));
  }

  /**
   * Get plan by ID with validation
   * Business Rule: Validate plan exists
   */
  async getPlanById(planId) {
    const plan = await this.planRepository.findById(planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Add business context
    return {
      ...plan,
      canDelete: plan._count?.users === 0,
      upgradeRecommendation: this.getUpgradeRecommendation(plan)
    };
  }

  /**
   * Create new plan with business validation
   * Business Rules:
   * - Name must be unique
   * - Limits must be positive
   * - Price must be reasonable
   */
  async createPlan(planData) {
    // Business validation
    this.validatePlanData(planData);
    
    // Check for duplicate names
    const existingPlan = await this.planRepository.findByName(planData.name);
    if (existingPlan) {
      throw new Error(`Plan with name '${planData.name}' already exists`);
    }

    // Business logic: Calculate recommended price based on features
    const recommendedPrice = this.calculateRecommendedPrice(planData);
    
    if (planData.price && Math.abs(planData.price - recommendedPrice) > recommendedPrice * 0.5) {
      console.warn(`Price ${planData.price} differs significantly from recommended ${recommendedPrice}`);
    }

    // Create plan
    const newPlan = await this.planRepository.create(planData);

    // Business event: Log plan creation
    console.log(`[BUSINESS EVENT] Plan created: ${newPlan.name} (ID: ${newPlan.id})`);

    return newPlan;
  }

  /**
   * Update plan with business validation
   * Business Rule: Cannot reduce limits if users would exceed new limits
   */
  async updatePlan(planId, updateData) {
    const existingPlan = await this.planRepository.findById(planId);
    
    if (!existingPlan) {
      throw new Error('Plan not found');
    }

    // Business validation: Cannot reduce limits if it affects existing users
    if (updateData.maxFiles && updateData.maxFiles < existingPlan.maxFiles) {
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

    // Validate update data
    if (updateData.name || updateData.maxFiles || updateData.maxCharts || updateData.maxDashboards) {
      this.validatePlanData({ ...existingPlan, ...updateData });
    }

    const updatedPlan = await this.planRepository.update(planId, updateData);

    console.log(`[BUSINESS EVENT] Plan updated: ${updatedPlan.name}`);

    return updatedPlan;
  }

  /**
   * Delete plan with business rules
   * Business Rule: Can only delete if no users are subscribed
   */
  async deletePlan(planId) {
    const plan = await this.planRepository.findById(planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Business rule: Cannot delete if users exist
    if (plan._count?.users > 0) {
      throw new Error(
        `Cannot delete plan '${plan.name}'. ${plan._count.users} user(s) are subscribed. ` +
        `Please migrate users to another plan first.`
      );
    }

    await this.planRepository.delete(planId);

    console.log(`[BUSINESS EVENT] Plan deleted: ${plan.name} (ID: ${planId})`);

    return { 
      success: true, 
      message: `Plan '${plan.name}' deleted successfully`,
      deletedPlan: plan
    };
  }

  /**
   * Get plan usage statistics
   * Business Logic: Complex calculations and aggregations
   */
  async getPlanStatistics(planId) {
    const plan = await this.planRepository.findById(planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    const userCount = plan._count?.users || 0;
    const revenue = this.calculateRevenue(plan);
    const utilizationRate = await this.calculateUtilizationRate(planId);

    return {
      planId: plan.id,
      planName: plan.name,
      subscribers: userCount,
      monthlyRevenue: revenue,
      averageUtilization: utilizationRate,
      isPopular: userCount > 10,
      recommendedActions: this.getRecommendedActions(plan, userCount, utilizationRate)
    };
  }

  /**
   * Compare multiple plans
   * Business Logic: Feature comparison and recommendations
   */
  async comparePlans(planIds) {
    const plans = await Promise.all(
      planIds.map(id => this.planRepository.findById(id))
    );

    const validPlans = plans.filter(p => p !== null);

    if (validPlans.length === 0) {
      throw new Error('No valid plans found');
    }

    return validPlans.map(plan => ({
      ...plan,
      valueScore: this.calculateValueScore(plan),
      bestFor: this.determineTargetAudience(plan)
    })).sort((a, b) => b.valueScore - a.valueScore);
  }

  // ========================================
  // PRIVATE BUSINESS LOGIC METHODS
  // ========================================

  /**
   * Validate plan data according to business rules
   */
  validatePlanData(data) {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Plan name is required');
    }

    if (data.name.length > 50) {
      throw new Error('Plan name must be 50 characters or less');
    }

    if (data.maxFiles !== undefined && data.maxFiles < 1) {
      throw new Error('maxFiles must be at least 1');
    }

    if (data.maxCharts !== undefined && data.maxCharts < 1) {
      throw new Error('maxCharts must be at least 1');
    }

    if (data.maxDashboards !== undefined && data.maxDashboards < 1) {
      throw new Error('maxDashboards must be at least 1');
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Business rule: Charts should be proportional to files
    if (data.maxFiles && data.maxCharts) {
      const ratio = data.maxCharts / data.maxFiles;
      if (ratio < 0.5 || ratio > 5) {
        console.warn(`Unusual charts-to-files ratio: ${ratio}. Consider adjusting limits.`);
      }
    }
  }

  /**
   * Calculate value score for a plan
   * Business algorithm: (features / price)
   */
  calculateValueScore(plan) {
    const features = plan.maxFiles + plan.maxCharts + plan.maxDashboards;
    const price = parseFloat(plan.price) || 1; // Avoid division by zero
    
    return price === 0 ? features : (features / price).toFixed(2);
  }

  /**
   * Calculate recommended price based on features
   * Business pricing model
   */
  calculateRecommendedPrice(plan) {
    const basePrice = 5;
    const filePrice = 0.5;
    const chartPrice = 0.3;
    const dashboardPrice = 1;

    return (
      basePrice +
      (plan.maxFiles * filePrice) +
      (plan.maxCharts * chartPrice) +
      (plan.maxDashboards * dashboardPrice)
    );
  }

  /**
   * Calculate monthly revenue from plan
   */
  calculateRevenue(plan) {
    const userCount = plan._count?.users || 0;
    const price = parseFloat(plan.price) || 0;
    return userCount * price;
  }

  /**
   * Calculate average resource utilization
   */
  async calculateUtilizationRate(planId) {
    // This would query actual usage data
    // For demo purposes, returning mock calculation
    return Math.random() * 100; // 0-100%
  }

  /**
   * Get upgrade recommendation for a plan
   */
  getUpgradeRecommendation(plan) {
    const valueScore = this.calculateValueScore(plan);
    
    if (valueScore > 50) {
      return 'Enterprise Plan - Best value for power users';
    } else if (valueScore > 20) {
      return 'Pro Plan - Perfect for growing teams';
    } else {
      return 'Free Plan - Great for getting started';
    }
  }

  /**
   * Determine target audience for plan
   */
  determineTargetAudience(plan) {
    if (parseFloat(plan.price) === 0) {
      return 'Individual users & hobbyists';
    } else if (parseFloat(plan.price) < 20) {
      return 'Small teams & startups';
    } else {
      return 'Enterprises & large organizations';
    }
  }

  /**
   * Get recommended actions based on plan metrics
   */
  getRecommendedActions(plan, userCount, utilizationRate) {
    const actions = [];

    if (userCount === 0) {
      actions.push('Consider marketing campaign to attract users');
    } else if (userCount > 50) {
      actions.push('High demand - consider creating premium tier');
    }

    if (utilizationRate < 30) {
      actions.push('Low utilization - consider reducing limits to save costs');
    } else if (utilizationRate > 80) {
      actions.push('High utilization - users may need upgrades');
    }

    return actions;
  }
}

module.exports = PlanService;
