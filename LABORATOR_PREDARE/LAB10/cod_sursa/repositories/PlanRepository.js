// Lab 10: Data Access Layer - Plan Repository
// Repository pattern that abstracts database operations

const prisma = require('../../config/prisma');

/**
 * PlanRepository - Data Access Layer for Plans
 * 
 * Responsibilities:
 * - Database queries
 * - CRUD operations
 * - Data mapping
 * - No business logic
 */
class PlanRepository {
  /**
   * Constructor with optional Prisma client injection
   * @param {Object} prismaClient - Injected Prisma client (for testing/mocking)
   */
  constructor(prismaClient = null) {
    this.prisma = prismaClient || prisma;
  }

  /**
   * Find all plans
   */
  async findAll() {
    return await this.prisma.plan.findMany({
      orderBy: {
        price: 'asc'
      },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });
  }

  /**
   * Find plan by ID
   */
  async findById(planId) {
    return await this.prisma.plan.findUnique({
      where: { id: planId },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });
  }

  /**
   * Find plan by name
   */
  async findByName(name) {
    return await this.prisma.plan.findUnique({
      where: { name: name }
    });
  }

  /**
   * Create new plan
   */
  async create(planData) {
    return await this.prisma.plan.create({
      data: {
        name: planData.name,
        maxFiles: parseInt(planData.maxFiles),
        maxCharts: parseInt(planData.maxCharts),
        maxDashboards: parseInt(planData.maxDashboards),
        price: parseFloat(planData.price || 0)
      }
    });
  }

  /**
   * Update plan
   */
  async update(planId, updateData) {
    const data = {};
    
    if (updateData.name !== undefined) data.name = updateData.name;
    if (updateData.maxFiles !== undefined) data.maxFiles = parseInt(updateData.maxFiles);
    if (updateData.maxCharts !== undefined) data.maxCharts = parseInt(updateData.maxCharts);
    if (updateData.maxDashboards !== undefined) data.maxDashboards = parseInt(updateData.maxDashboards);
    if (updateData.price !== undefined) data.price = parseFloat(updateData.price);

    return await this.prisma.plan.update({
      where: { id: planId },
      data: data
    });
  }

  /**
   * Delete plan
   */
  async delete(planId) {
    return await this.prisma.plan.delete({
      where: { id: planId }
    });
  }

  /**
   * Get count of users exceeding a specific limit
   * Used for business validation when updating plan limits
   */
  async getUsersExceedingLimit(planId, resourceType, newLimit) {
    // This is a complex query that would check actual user usage
    // For demonstration, returning mock data
    
    const plan = await this.findById(planId);
    if (!plan) return 0;

    // In real implementation, this would query actual user resource usage
    // Example pseudo-query:
    // SELECT COUNT(*) FROM users u
    // LEFT JOIN (SELECT user_id, COUNT(*) as file_count FROM files GROUP BY user_id) f ON u.id = f.user_id
    // WHERE u.plan_id = planId AND f.file_count > newLimit

    return 0; // Mock: no users exceed limit
  }

  /**
   * Get plans with user count greater than threshold
   */
  async findPopularPlans(minUsers = 10) {
    const allPlans = await this.findAll();
    return allPlans.filter(plan => (plan._count?.users || 0) >= minUsers);
  }

  /**
   * Get plan statistics
   */
  async getStatistics(planId) {
    const plan = await this.findById(planId);
    
    if (!plan) return null;

    return {
      id: plan.id,
      name: plan.name,
      userCount: plan._count?.users || 0,
      price: parseFloat(plan.price),
      limits: {
        files: plan.maxFiles,
        charts: plan.maxCharts,
        dashboards: plan.maxDashboards
      }
    };
  }
}

module.exports = PlanRepository;
