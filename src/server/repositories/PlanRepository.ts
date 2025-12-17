/**
 * PlanRepository - Data Access Layer
 * Locație: src/server/repositories/PlanRepository.ts
 * 
 * Folosit în:
 * - src/server/services/PlanService.ts (dependency injection)
 * - src/app/api/plans/route.ts (prin service layer)
 * - LABORATOR_PREDARE/LAB10 (exemplu arhitectură DI)
 * 
 * Responsabilități:
 * - CRUD operations pentru entitatea Plan
 * - Query-uri database prin Prisma ORM
 * - Mapping între database models și DTOs
 * - NO business logic (doar data access)
 */

import { PrismaClient, Plan } from '@prisma/client';

export interface PlanWithCount extends Plan {
  _count?: {
    users: number;
  };
}

export class PlanRepository {
  private prisma: PrismaClient;

  /**
   * Constructor cu Dependency Injection
   * @param prismaClient - Injectat pentru testability (poate fi mock în teste)
   */
  constructor(prismaClient?: PrismaClient) {
    // Folosim singleton Prisma client pentru production
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Find all plans
   * Folosit de: PlanService.getAllPlans()
   */
  async findAll(): Promise<PlanWithCount[]> {
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
   * Folosit de: PlanService.getPlanById(), updatePlan(), deletePlan()
   */
  async findById(planId: string): Promise<PlanWithCount | null> {
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
   * Folosit de: PlanService.createPlan() (verificare unicitate)
   */
  async findByName(name: string): Promise<Plan | null> {
    return await this.prisma.plan.findUnique({
      where: { name: name }
    });
  }

  /**
   * Create new plan
   * Folosit de: PlanService.createPlan()
   */
  async create(planData: {
    name: string;
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
    price: number;
  }): Promise<Plan> {
    return await this.prisma.plan.create({
      data: {
        name: planData.name,
        maxFiles: parseInt(String(planData.maxFiles)),
        maxCharts: parseInt(String(planData.maxCharts)),
        maxDashboards: parseInt(String(planData.maxDashboards)),
        price: parseFloat(String(planData.price || 0))
      }
    });
  }

  /**
   * Update plan
   * Folosit de: PlanService.updatePlan()
   */
  async update(planId: string, updateData: Partial<{
    name: string;
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
    price: number;
  }>): Promise<Plan> {
    const data: any = {};
    
    if (updateData.name !== undefined) data.name = updateData.name;
    if (updateData.maxFiles !== undefined) data.maxFiles = parseInt(String(updateData.maxFiles));
    if (updateData.maxCharts !== undefined) data.maxCharts = parseInt(String(updateData.maxCharts));
    if (updateData.maxDashboards !== undefined) data.maxDashboards = parseInt(String(updateData.maxDashboards));
    if (updateData.price !== undefined) data.price = parseFloat(String(updateData.price));

    return await this.prisma.plan.update({
      where: { id: planId },
      data: data
    });
  }

  /**
   * Delete plan
   * Folosit de: PlanService.deletePlan()
   */
  async delete(planId: string): Promise<Plan> {
    return await this.prisma.plan.delete({
      where: { id: planId }
    });
  }

  /**
   * Get users count exceeding limit
   * Business validation helper
   */
  async getUsersExceedingLimit(planId: string, resourceType: string, newLimit: number): Promise<number> {
    const plan = await this.findById(planId);
    if (!plan) return 0;

    // TODO: Implement actual query pentru user resource usage
    // SELECT COUNT(*) FROM users u
    // LEFT JOIN (SELECT user_id, COUNT(*) as file_count FROM files GROUP BY user_id) f
    // WHERE u.plan_id = planId AND f.file_count > newLimit

    return 0; // Mock: no users exceed limit
  }

  /**
   * Get popular plans (more than threshold users)
   */
  async findPopularPlans(minUsers: number = 10): Promise<PlanWithCount[]> {
    const allPlans = await this.findAll();
    return allPlans.filter(plan => (plan._count?.users || 0) >= minUsers);
  }

  /**
   * Cleanup connection
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance pentru production usage
export const planRepository = new PlanRepository();
