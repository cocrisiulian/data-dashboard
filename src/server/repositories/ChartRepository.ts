/**
 * ChartRepository - Data Access Layer pentru Charts
 * Locație: src/server/repositories/ChartRepository.ts
 */

import { PrismaClient, Chart } from '@prisma/client';

export interface ChartWithFile extends Chart {
  file?: {
    id: string;
    fileName: string;
    fileType: string;
    filePath: string;
  };
  dashboard?: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class ChartRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Find all charts pentru un dashboard
   */
  async findAllByDashboardId(dashboardId: string): Promise<ChartWithFile[]> {
    return await this.prisma.chart.findMany({
      where: { dashboardId },
      include: {
        file: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            filePath: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Find chart by ID cu file info
   */
  async findById(chartId: string): Promise<ChartWithFile | null> {
    return await this.prisma.chart.findUnique({
      where: { id: chartId },
      include: {
        dashboard: true,
        file: true
      }
    }) as ChartWithFile | null;
  }

  /**
   * Create new chart
   */
  async create(chartData: {
    dashboardId: string;
    fileId: string | null;
    chartType: string;
    chartConfig: any;
    title: string;
  }): Promise<Chart> {
    const data: any = {
      dashboardId: chartData.dashboardId,
      chartType: chartData.chartType,
      chartConfig: chartData.chartConfig,
      title: chartData.title
    };

    // Only add fileId if it's not null
    if (chartData.fileId) {
      data.fileId = chartData.fileId;
    }

    return await this.prisma.chart.create({
      data
    });
  }

  /**
   * Update chart
   */
  async update(chartId: string, updateData: Partial<{
    title: string;
    chartType: string;
    chartConfig: any;
    fileId: string | null;
  }>): Promise<Chart> {
    const data: any = {};
    if (updateData.title !== undefined) data.title = updateData.title;
    if (updateData.chartType !== undefined) data.chartType = updateData.chartType;
    if (updateData.chartConfig !== undefined) data.chartConfig = updateData.chartConfig;
    if (updateData.fileId !== undefined) data.fileId = updateData.fileId || undefined;

    return await this.prisma.chart.update({
      where: { id: chartId },
      data
    });
  }

  /**
   * Delete chart
   */
  async delete(chartId: string): Promise<Chart> {
    return await this.prisma.chart.delete({
      where: { id: chartId }
    });
  }

  /**
   * Count charts pentru dashboard (plan limit check)
   */
  async countByDashboardId(dashboardId: string): Promise<number> {
    return await this.prisma.chart.count({
      where: { dashboardId }
    });
  }

  /**
   * Count total charts pentru user (across all dashboards)
   */
  async countByUserId(userId: string): Promise<number> {
    return await this.prisma.chart.count({
      where: {
        dashboard: {
          userId
        }
      }
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const chartRepository = new ChartRepository();
