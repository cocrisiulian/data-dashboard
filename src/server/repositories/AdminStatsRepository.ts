import { PrismaClient } from '@prisma/client';
import { ILogger } from '../infrastructure/logger';

export interface KPIStats {
  totalUsers: number;
  totalDashboards: number;
  totalFiles: number;
  totalCharts: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface DashboardsByPlan {
  planName: string;
  count: number;
}

export interface ChartTypeDistribution {
  type: string;
  count: number;
}

export interface TopUser {
  id: string;
  email: string;
  fullName: string | null;
  dashboardCount: number;
  chartCount: number;
  fileCount: number;
}

export interface RecentUser {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: Date;
  planName: string;
}

export interface IAdminStatsRepository {
  getTotalUsers(): Promise<number>;
  getTotalDashboards(): Promise<number>;
  getTotalFiles(): Promise<number>;
  getTotalCharts(): Promise<number>;
  getUserGrowth(days: number): Promise<{ date: string; count: number }[]>;
  getDashboardsByPlan(): Promise<{ planName: string; count: number }[]>;
  getChartTypesDistribution(): Promise<{ type: string; count: number }[]>;
  getTopActiveUsers(limit: number): Promise<any[]>;
  getRecentUsers(limit: number): Promise<any[]>;
  getActivityTimeline(days: number): Promise<any[]>;
}

export class AdminStatsRepository implements IAdminStatsRepository {
  constructor(
    private prisma: PrismaClient,
    private logger: ILogger
  ) {}

  async getTotalUsers(): Promise<number> {
    try {
      return await this.prisma.user.count();
    } catch (error) {
      this.logger.error('Failed to count users', { error });
      throw error;
    }
  }

  async getTotalDashboards(): Promise<number> {
    try {
      return await this.prisma.dashboard.count();
    } catch (error) {
      this.logger.error('Failed to count dashboards', { error });
      throw error;
    }
  }

  async getTotalFiles(): Promise<number> {
    try {
      return await this.prisma.file.count();
    } catch (error) {
      this.logger.error('Failed to count files', { error });
      throw error;
    }
  }

  async getTotalCharts(): Promise<number> {
    try {
      return await this.prisma.chart.count();
    } catch (error) {
      this.logger.error('Failed to count charts', { error });
      throw error;
    }
  }

  async getUserGrowth(days: number = 30): Promise<Array<{ date: string; count: number }>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const users = await this.prisma.user.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        select: {
          createdAt: true
        },
        orderBy: { createdAt: 'asc' }
      });

      // Group by date
      const grouped = users.reduce((acc: Record<string, number>, user) => {
        const date = user.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(grouped).map(([date, count]) => ({
        date,
        count
      }));
    } catch (error) {
      this.logger.error('Failed to fetch user growth data', { error, days });
      throw error;
    }
  }

  async getDashboardsByPlan(): Promise<Array<{ planName: string; count: number }>> {
    try {
      const result = await this.prisma.dashboard.groupBy({
        by: ['userId'],
        _count: { id: true }
      });

      // Get user plans
      const userIds = result.map(r => r.userId);
      const users = await this.prisma.user.findMany({
        where: { id: { in: userIds } },
        include: { plan: true }
      });

      const planCounts: Record<string, number> = {};
      
      result.forEach(item => {
        const user = users.find(u => u.id === item.userId);
        if (user?.plan) {
          const planName = user.plan.name;
          planCounts[planName] = (planCounts[planName] || 0) + item._count.id;
        }
      });

      return Object.entries(planCounts).map(([planName, count]) => ({
        planName,
        count
      }));
    } catch (error) {
      this.logger.error('Failed to fetch dashboards by plan', { error });
      throw error;
    }
  }

  async getChartTypesDistribution(): Promise<Array<{ type: string; count: number }>> {
    try {
      const result = await this.prisma.chart.groupBy({
        by: ['chartType'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      });

      return result.map(item => ({
        type: item.chartType,
        count: item._count?.id || 0
      }));
    } catch (error) {
      this.logger.error('Failed to fetch chart types distribution', { error });
      throw error;
    }
  }

  async getTopActiveUsers(limit: number = 10): Promise<any[]> {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          _count: {
            select: {
              dashboards: true,
              files: true
            }
          }
        }
      });

      // Calculate activity score
      const usersWithScore = users.map(user => ({
        ...user,
        activityScore:
          user._count.dashboards * 3 +
          user._count.files * 1
      }));

      // Sort by score and take top N
      return usersWithScore
        .sort((a, b) => b.activityScore - a.activityScore)
        .slice(0, limit);
    } catch (error) {
      this.logger.error('Failed to fetch top active users', { error, limit });
      throw error;
    }
  }

  async getActivityTimeline(days: number = 7): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await this.prisma.activityLog.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        select: {
          createdAt: true,
          level: true
        },
        orderBy: { createdAt: 'asc' }
      });

      // Group by date and level
      const grouped: Record<string, Record<string, number>> = {};
      
      logs.forEach((log: any) => {
        const date = log.createdAt.toISOString().split('T')[0];
        if (!grouped[date]) grouped[date] = { INFO: 0, WARN: 0, ERROR: 0 };
        grouped[date][log.level] = (grouped[date][log.level] || 0) + 1;
      });

      return Object.entries(grouped).map(([date, counts]) => ({
        date,
        ...counts
      }));
    } catch (error) {
      this.logger.error('Failed to fetch activity timeline', { error, days });
      throw error;
    }
  }

  async getRecentUsers(limit: number = 10): Promise<any[]> {
    try {
      return await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
          plan: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              dashboards: true,
              files: true
            }
          }
        }
      });
    } catch (error) {
      this.logger.error('Failed to fetch recent users', { error, limit });
      throw error;
    }
  }
}
