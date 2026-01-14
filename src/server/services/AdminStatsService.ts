import { IAdminStatsRepository } from '../repositories/AdminStatsRepository';
import { ILogger } from '../infrastructure/logger';

export interface AdminKPIs {
  totalUsers: number;
  totalDashboards: number;
  totalFiles: number;
  totalCharts: number;
}

export interface IAdminStatsService {
  getKPIs(): Promise<AdminKPIs>;
  getUserGrowth(days?: number): Promise<any[]>;
  getDashboardsByPlan(): Promise<any[]>;
  getChartTypesDistribution(): Promise<any[]>;
  getTopActiveUsers(limit?: number): Promise<any[]>;
  getRecentUsers(limit?: number): Promise<any[]>;
  getActivityTimeline(days?: number): Promise<any[]>;
  getStorageUsage(): Promise<any[]>;
}

export class AdminStatsService implements IAdminStatsService {
  constructor(
    private adminStatsRepository: IAdminStatsRepository,
    private logger: ILogger
  ) {}

  async getKPIs(): Promise<AdminKPIs> {
    try {
      const [totalUsers, totalDashboards, totalFiles, totalCharts] = await Promise.all([
        this.adminStatsRepository.getTotalUsers(),
        this.adminStatsRepository.getTotalDashboards(),
        this.adminStatsRepository.getTotalFiles(),
        this.adminStatsRepository.getTotalCharts()
      ]);

      return {
        totalUsers,
        totalDashboards,
        totalFiles,
        totalCharts
      };
    } catch (error) {
      this.logger.error('Failed to fetch KPIs', { error });
      throw new Error('Failed to fetch KPIs');
    }
  }

  async getUserGrowth(days: number = 30): Promise<any[]> {
    try {
      return await this.adminStatsRepository.getUserGrowth(days);
    } catch (error) {
      this.logger.error('Failed to fetch user growth', { error, days });
      throw new Error('Failed to fetch user growth');
    }
  }

  async getDashboardsByPlan(): Promise<any[]> {
    try {
      return await this.adminStatsRepository.getDashboardsByPlan();
    } catch (error) {
      this.logger.error('Failed to fetch dashboards by plan', { error });
      throw new Error('Failed to fetch dashboards by plan');
    }
  }

  async getChartTypesDistribution(): Promise<any[]> {
    try {
      return await this.adminStatsRepository.getChartTypesDistribution();
    } catch (error) {
      this.logger.error('Failed to fetch chart types distribution', { error });
      throw new Error('Failed to fetch chart types distribution');
    }
  }

  async getTopActiveUsers(limit: number = 10): Promise<any[]> {
    try {
      return await this.adminStatsRepository.getTopActiveUsers(limit);
    } catch (error) {
      this.logger.error('Failed to fetch top active users', { error, limit });
      throw new Error('Failed to fetch top active users');
    }
  }

  async getRecentUsers(limit: number = 10): Promise<any[]> {
    try {
      return await this.adminStatsRepository.getRecentUsers(limit);
    } catch (error) {
      this.logger.error('Failed to fetch recent users', { error, limit });
      throw new Error('Failed to fetch recent users');
    }
  }

  async getActivityTimeline(days: number = 7): Promise<any[]> {
    try {
      return await this.adminStatsRepository.getActivityTimeline(days);
    } catch (error) {
      this.logger.error('Failed to fetch activity timeline', { error, days });
      throw new Error('Failed to fetch activity timeline');
    }
  }

  async getStorageUsage(): Promise<any[]> {
    try {
      // Storage usage removed - not needed for current implementation
      return [];
    } catch (error) {
      this.logger.error('Failed to fetch storage usage', { error });
      throw new Error('Failed to fetch storage usage');
    }
  }
}
