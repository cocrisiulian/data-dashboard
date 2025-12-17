/**
 * DashboardService - Business Logic Layer pentru Dashboards
 * Locație: src/server/services/DashboardService.ts
 */

import { DashboardRepository } from '../repositories/DashboardRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Dashboard } from '@prisma/client';

export interface DashboardDTO {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  charts?: Array<{
    id: string;
    dashboard_id: string;
    file_id: string | null;
    chart_type: string;
    chart_config: any;
    title: string;
    created_at: Date;
    file?: {
      id: string;
      file_name: string;
      file_type: string;
      file_path: string;
    };
  }>;
}

export class DashboardService {
  private dashboardRepository: DashboardRepository;
  private userRepository: UserRepository;

  constructor(
    dashboardRepository: DashboardRepository,
    userRepository: UserRepository
  ) {
    this.dashboardRepository = dashboardRepository;
    this.userRepository = userRepository;
  }

  /**
   * Get all dashboards pentru user
   */
  async getAllDashboards(userId: string): Promise<DashboardDTO[]> {
    const dashboards = await this.dashboardRepository.findAllByUserId(userId);
    
    return dashboards.map((dashboard: Dashboard) => this.toDTO(dashboard));
  }

  /**
   * Get single dashboard cu ownership validation
   */
  async getDashboardById(dashboardId: string, userId: string): Promise<DashboardDTO> {
    const dashboard = await this.dashboardRepository.findByIdAndUserId(dashboardId, userId);
    
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    return this.toDTO(dashboard);
  }

  /**
   * Create dashboard cu plan limit validation
   * Business Rule: Check max_dashboards limit
   */
  async createDashboard(
    userId: string,
    dashboardData: {
      name: string;
      description?: string;
    }
  ): Promise<DashboardDTO> {
    // Business validation: Check dashboard limit
    const hasReachedLimit = await this.userRepository.hasReachedDashboardLimit(userId);
    
    if (hasReachedLimit) {
      const user = await this.userRepository.findById(userId);
      const planName = user?.plan?.name || 'current';
      const maxDashboards = user?.plan?.maxDashboards || 0;
      
      throw new Error(
        `Dashboard limit reached. Your ${planName} plan allows ${maxDashboards} dashboards.`
      );
    }

    const dashboard = await this.dashboardRepository.create({
      userId,
      name: dashboardData.name,
      description: dashboardData.description
    });

    console.log(`[DASHBOARD SERVICE] Dashboard created: ${dashboard.name} (User: ${userId})`);

    return this.toDTO(dashboard);
  }

  /**
   * Update dashboard cu ownership validation
   */
  async updateDashboard(
    dashboardId: string,
    userId: string,
    updateData: Partial<{
      name: string;
      description: string;
    }>
  ): Promise<DashboardDTO> {
    const dashboard = await this.dashboardRepository.findByIdAndUserId(dashboardId, userId);
    
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    const updatedDashboard = await this.dashboardRepository.update(dashboardId, updateData);

    console.log(`[DASHBOARD SERVICE] Dashboard updated: ${updatedDashboard.name} (ID: ${dashboardId})`);

    return this.toDTO(updatedDashboard);
  }

  /**
   * Delete dashboard cu ownership validation
   * Business Rule: Cascade delete charts
   */
  async deleteDashboard(dashboardId: string, userId: string): Promise<void> {
    const dashboard = await this.dashboardRepository.findByIdAndUserId(dashboardId, userId);
    
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    // Prisma cascade delete va șterge automat toate charts
    await this.dashboardRepository.delete(dashboardId);

    console.log(`[DASHBOARD SERVICE] Dashboard deleted: ${dashboard.name} (ID: ${dashboardId})`);
  }

  /**
   * Transform Dashboard la DTO (snake_case)
   */
  private toDTO(dashboard: any): DashboardDTO {
    const dto: DashboardDTO = {
      id: dashboard.id,
      user_id: dashboard.userId,
      name: dashboard.name,
      description: dashboard.description,
      created_at: dashboard.createdAt,
      updated_at: dashboard.updatedAt
    };

    if (dashboard.charts) {
      dto.charts = dashboard.charts.map((chart: any) => ({
        id: chart.id,
        dashboard_id: chart.dashboardId,
        file_id: chart.fileId,
        chart_type: chart.chartType,
        chart_config: chart.chartConfig,
        title: chart.title,
        created_at: chart.createdAt,
        file: chart.file ? {
          id: chart.file.id,
          file_name: chart.file.fileName,
          file_type: chart.file.fileType,
          file_path: chart.file.filePath
        } : undefined
      }));
    }

    return dto;
  }
}

// Export singleton
import { dashboardRepository } from '../repositories/DashboardRepository';
import { userRepository } from '../repositories/UserRepository';
export const dashboardService = new DashboardService(dashboardRepository, userRepository);
