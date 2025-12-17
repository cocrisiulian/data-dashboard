/**
 * DashboardRepository - Data Access Layer pentru Dashboards
 * Locație: src/server/repositories/DashboardRepository.ts
 */

import { PrismaClient, Dashboard } from '@prisma/client';

export interface DashboardWithCharts extends Dashboard {
  charts?: Array<{
    id: string;
    chartType: string;
    title: string;
    chartConfig?: any;
    file?: {
      id: string;
      fileName: string;
      fileType: string;
      filePath: string;
    };
  }>;
}

export class DashboardRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Find all dashboards pentru user
   */
  async findAllByUserId(userId: string): Promise<DashboardWithCharts[]> {
    return await this.prisma.dashboard.findMany({
      where: { userId },
      include: {
        charts: {
          select: {
            id: true,
            chartType: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Find dashboard by ID cu ownership check
   */
  async findByIdAndUserId(dashboardId: string, userId: string): Promise<DashboardWithCharts | null> {
    return await this.prisma.dashboard.findFirst({
      where: {
        id: dashboardId,
        userId
      },
      include: {
        charts: {
          include: {
            file: {
              select: {
                id: true,
                fileName: true,
                fileType: true,
                filePath: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Find dashboard by ID (fără ownership check)
   */
  async findById(dashboardId: string): Promise<Dashboard | null> {
    return await this.prisma.dashboard.findUnique({
      where: { id: dashboardId }
    });
  }

  /**
   * Create new dashboard
   */
  async create(dashboardData: {
    userId: string;
    name: string;
    description?: string;
  }): Promise<Dashboard> {
    return await this.prisma.dashboard.create({
      data: dashboardData
    });
  }

  /**
   * Update dashboard
   */
  async update(dashboardId: string, updateData: Partial<{
    name: string;
    description: string;
  }>): Promise<Dashboard> {
    return await this.prisma.dashboard.update({
      where: { id: dashboardId },
      data: updateData
    });
  }

  /**
   * Delete dashboard (cascade delete charts)
   */
  async delete(dashboardId: string): Promise<Dashboard> {
    return await this.prisma.dashboard.delete({
      where: { id: dashboardId }
    });
  }

  /**
   * Count dashboards pentru user (plan limit check)
   */
  async countByUserId(userId: string): Promise<number> {
    return await this.prisma.dashboard.count({
      where: { userId }
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const dashboardRepository = new DashboardRepository();
