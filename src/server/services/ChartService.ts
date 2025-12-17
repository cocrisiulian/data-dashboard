/**
 * ChartService - Business Logic Layer pentru Charts
 * Locație: src/server/services/ChartService.ts
 */

import { ChartRepository } from '../repositories/ChartRepository';
import { DashboardRepository } from '../repositories/DashboardRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Chart } from '@prisma/client';

export interface ChartDTO {
  id: string;
  title: string;
  chart_type: string;
  chart_config: any;
  dashboard_id: string;
  file_id: string | null;
  created_at: Date;
  file?: {
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
  };
}

export class ChartService {
  private chartRepository: ChartRepository;
  private dashboardRepository: DashboardRepository;
  private userRepository: UserRepository;

  constructor(
    chartRepository: ChartRepository,
    dashboardRepository: DashboardRepository,
    userRepository: UserRepository
  ) {
    this.chartRepository = chartRepository;
    this.dashboardRepository = dashboardRepository;
    this.userRepository = userRepository;
  }

  /**
   * Get all charts pentru dashboard cu ownership validation
   */
  async getChartsByDashboardId(dashboardId: string, userId: string): Promise<ChartDTO[]> {
    // Business validation: Verify dashboard ownership
    const dashboard = await this.dashboardRepository.findByIdAndUserId(dashboardId, userId);
    
    if (!dashboard) {
      throw new Error('Dashboard not found or access denied');
    }

    const charts = await this.chartRepository.findAllByDashboardId(dashboardId);
    
    return charts.map(chart => this.toDTO(chart));
  }

  /**
   * Get single chart cu ownership validation
   */
  async getChartById(chartId: string, userId: string): Promise<ChartDTO> {
    const chart = await this.chartRepository.findById(chartId);
    
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Business validation: Verify ownership prin dashboard
    if (chart.dashboard && chart.dashboard.userId !== userId) {
      throw new Error('Access denied');
    }

    return this.toDTO(chart);
  }

  /**
   * Create chart cu plan limit validation
   * Business Rule: Check max_charts limit
   */
  async createChart(
    userId: string,
    chartData: {
      dashboardId: string;
      fileId: string | null;
      chartType: string;
      chartConfig: any;
      title: string;
    }
  ): Promise<ChartDTO> {
    // Verify dashboard ownership
    const dashboard = await this.dashboardRepository.findByIdAndUserId(
      chartData.dashboardId,
      userId
    );
    
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    // Business validation: Check chart limit
    const user = await this.userRepository.findById(userId);
    const totalCharts = await this.chartRepository.countByUserId(userId);
    const maxCharts = user?.plan?.maxCharts;

    if (maxCharts !== null && maxCharts !== undefined && maxCharts !== -1 && totalCharts >= maxCharts) {
      throw new Error(
        `Chart limit reached. Your ${user?.plan?.name} plan allows ${maxCharts} charts.`
      );
    }

    const chart = await this.chartRepository.create(chartData);

    console.log(`[CHART SERVICE] Chart created: ${chart.title} (Dashboard: ${chartData.dashboardId})`);

    return this.toDTO(chart);
  }

  /**
   * Update chart cu ownership validation
   */
  async updateChart(
    chartId: string,
    userId: string,
    updateData: Partial<{
      title: string;
      chartType: string;
      chartConfig: any;
      fileId: string | null;
    }>
  ): Promise<ChartDTO> {
    const chart = await this.chartRepository.findById(chartId);
    
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Verify ownership
    if (chart.dashboard && chart.dashboard.userId !== userId) {
      throw new Error('Access denied');
    }

    const updatedChart = await this.chartRepository.update(chartId, updateData);

    console.log(`[CHART SERVICE] Chart updated: ${updatedChart.title} (ID: ${chartId})`);

    return this.toDTO(updatedChart);
  }

  /**
   * Delete chart cu ownership validation
   */
  async deleteChart(chartId: string, userId: string): Promise<void> {
    const chart = await this.chartRepository.findById(chartId);
    
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Verify ownership
    if (chart.dashboard && chart.dashboard.userId !== userId) {
      throw new Error('Access denied');
    }

    await this.chartRepository.delete(chartId);

    console.log(`[CHART SERVICE] Chart deleted: ${chart.title} (ID: ${chartId})`);
  }

  /**
   * Transform Chart la DTO (snake_case)
   */
  private toDTO(chart: any): ChartDTO {
    return {
      id: chart.id,
      title: chart.title,
      chart_type: chart.chartType,
      chart_config: chart.chartConfig,
      dashboard_id: chart.dashboardId,
      file_id: chart.fileId,
      created_at: chart.createdAt,
      file: chart.file ? {
        id: chart.file.id,
        file_name: chart.file.fileName,
        file_type: chart.file.fileType,
        file_path: chart.file.filePath
      } : undefined
    };
  }
}

// Export singleton
import { chartRepository } from '../repositories/ChartRepository';
import { dashboardRepository } from '../repositories/DashboardRepository';
import { userRepository } from '../repositories/UserRepository';
export const chartService = new ChartService(chartRepository, dashboardRepository, userRepository);
