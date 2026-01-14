/**
 * LAB10 - Simple Service Layer Implementation (Pure JavaScript)
 * This is a simplified version for labs_api (Express.js)
 * For full TypeScript implementation, see: src/server/services/
 */

const prisma = require('../config/prisma');

class PlanService {
  constructor() {
    this.prisma = prisma;
  }

  /**
   * Get all plans with business logic
   */
  async getAllPlans() {
    const plans = await this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    // Business Logic: Mark the plan with most users as popular
    const maxUsers = Math.max(...plans.map(plan => plan._count.users));
    
    return plans.map(plan => ({
      ...plan,
      isPopular: plan._count.users === maxUsers && maxUsers > 0
    }));
  }

  /**
   * Get plan by ID
   */
  async getPlanById(id) {
    return await this.prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
  }

  /**
   * Validate plan data (Business Logic)
   */
  validatePlanData(data) {
    if (!data.name || data.name.length < 3) {
      throw new Error('Plan name must be at least 3 characters');
    }

    if (data.maxFiles < 0 || data.maxCharts < 0 || data.maxDashboards < 0) {
      throw new Error('Limits must be positive numbers');
    }

    if (data.price < 0) {
      throw new Error('Price must be positive');
    }
  }
}

// Singleton instance
const planService = new PlanService();

module.exports = planService;
