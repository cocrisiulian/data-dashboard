/**
 * UserRepository - Data Access Layer pentru Users & Auth
 * Locație: src/server/repositories/UserRepository.ts
 */

import { PrismaClient, User } from '@prisma/client';

export interface UserWithPlan extends User {
  plan?: {
    id: string;
    name: string;
    maxFiles: number | null;
    maxCharts: number | null;
    maxDashboards: number | null;
    price: any;
  } | null;
  _count?: {
    files: number;
    dashboards: number;
  };
}

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UserWithPlan | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        plan: true
      }
    });
  }

  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<UserWithPlan | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        plan: true,
        _count: {
          select: {
            files: true,
            dashboards: true
          }
        }
      }
    });
  }

  /**
   * Create new user
   */
  async create(userData: {
    email: string;
    password: string;
    planId: string;
  }): Promise<User> {
    return await this.prisma.user.create({
      data: userData
    });
  }

  /**
   * Update user
   */
  async update(userId: string, updateData: Partial<{
    email: string;
    password: string;
    planId: string;
  }>): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });
  }

  /**
   * Delete user
   */
  async delete(userId: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id: userId }
    });
  }

  /**
   * Check dacă user a atins file limit
   */
  async hasReachedFileLimit(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.plan) return false;

    const maxFiles = user.plan.maxFiles;
    if (maxFiles === null || maxFiles === -1) return false; // Unlimited

    const fileCount = user._count?.files || 0;
    return fileCount >= maxFiles;
  }

  /**
   * Check dacă user a atins dashboard limit
   */
  async hasReachedDashboardLimit(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.plan) return false;

    const maxDashboards = user.plan.maxDashboards;
    if (maxDashboards === null || maxDashboards === -1) return false;

    const dashboardCount = user._count?.dashboards || 0;
    return dashboardCount >= maxDashboards;
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const userRepository = new UserRepository();
