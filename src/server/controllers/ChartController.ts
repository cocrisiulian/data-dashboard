/**
 * ChartController - Presentation/HTTP Layer pentru Charts
 * Locație: src/server/controllers/ChartController.ts
 * 
 * Folosit în:
 * - src/app/api/charts/route.ts
 * - src/app/api/charts/[id]/route.ts
 * 
 * Flow: API Route → ChartController → ChartService → ChartRepository → DB
 */

import { ChartService, ChartDTO } from '../services/ChartService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export class ChartController {
  private chartService: ChartService;

  constructor(chartService: ChartService) {
    this.chartService = chartService;
  }

  /**
   * GET /api/charts?dashboardId=xxx
   * Get all charts pentru un dashboard
   * 
   * Query params: dashboardId (required)
   * 
   * Response: 200 OK sau 400 Bad Request
   */
  async getChartsByDashboard(dashboardId: string, userId: string): Promise<ApiResponse<ChartDTO[]>> {
    try {
      if (!dashboardId) {
        return {
          success: false,
          message: 'dashboardId query parameter is required'
        };
      }

      const charts = await this.chartService.getChartsByDashboardId(dashboardId, userId);

      return {
        success: true,
        count: charts.length,
        data: charts
      };
    } catch (error) {
      console.error('[ChartController] Error in getChartsByDashboard:', error);

      if (error instanceof Error && error.message.includes('not found')) {
        return {
          success: false,
          message: error.message
        };
      }

      if (error instanceof Error && error.message.includes('access denied')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error fetching charts',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * GET /api/charts/:id
   * Get single chart by ID
   * 
   * Response: 200 OK sau 404 Not Found sau 403 Forbidden
   */
  async getChartById(chartId: string, userId: string): Promise<ApiResponse<ChartDTO>> {
    try {
      const chart = await this.chartService.getChartById(chartId, userId);

      return {
        success: true,
        data: chart
      };
    } catch (error) {
      console.error('[ChartController] Error in getChartById:', error);

      if (error instanceof Error && error.message === 'Chart not found') {
        return {
          success: false,
          message: error.message
        };
      }

      if (error instanceof Error && error.message === 'Access denied') {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error fetching chart',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * POST /api/charts
   * Create new chart
   * 
   * Request Body:
   * {
   *   "dashboardId": "...",
   *   "fileId": "...",
   *   "chartType": "bar",
   *   "chartConfig": {...},
   *   "title": "Sales Chart"
   * }
   * 
   * Response: 201 Created sau 403 Forbidden (limit)
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
  ): Promise<ApiResponse<ChartDTO>> {
    try {
      // Basic validation
      if (!chartData.dashboardId) {
        return {
          success: false,
          message: 'dashboardId is required'
        };
      }

      if (!chartData.title) {
        return {
          success: false,
          message: 'title is required'
        };
      }

      if (!chartData.chartType) {
        return {
          success: false,
          message: 'chartType is required'
        };
      }

      const chart = await this.chartService.createChart(userId, chartData);

      return {
        success: true,
        message: 'Chart created successfully',
        data: chart
      };
    } catch (error) {
      console.error('[ChartController] Error in createChart:', error);

      // Handle business validation errors
      if (error instanceof Error && error.message.includes('not found')) {
        return {
          success: false,
          message: error.message
        };
      }

      if (error instanceof Error && error.message.includes('limit reached')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error creating chart',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * PUT /api/charts/:id
   * Update existing chart
   * 
   * Request Body (partial):
   * {
   *   "title": "Updated Title",
   *   "chartConfig": {...}
   * }
   * 
   * Response: 200 OK sau 404 Not Found sau 403 Forbidden
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
  ): Promise<ApiResponse<ChartDTO>> {
    try {
      const chart = await this.chartService.updateChart(chartId, userId, updateData);

      return {
        success: true,
        message: 'Chart updated successfully',
        data: chart
      };
    } catch (error) {
      console.error('[ChartController] Error in updateChart:', error);

      if (error instanceof Error && error.message === 'Chart not found') {
        return {
          success: false,
          message: error.message
        };
      }

      if (error instanceof Error && error.message === 'Access denied') {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error updating chart',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * DELETE /api/charts/:id
   * Delete chart
   * 
   * Response: 200 OK sau 404 Not Found sau 403 Forbidden
   */
  async deleteChart(chartId: string, userId: string): Promise<ApiResponse> {
    try {
      await this.chartService.deleteChart(chartId, userId);

      return {
        success: true,
        message: 'Chart deleted successfully'
      };
    } catch (error) {
      console.error('[ChartController] Error in deleteChart:', error);

      if (error instanceof Error && error.message === 'Chart not found') {
        return {
          success: false,
          message: error.message
        };
      }

      if (error instanceof Error && error.message === 'Access denied') {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error deleting chart',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Helper: Convert controller response to Next.js Response
   */
  static toNextResponse(apiResponse: ApiResponse, defaultStatus: number = 200): Response {
    let status = defaultStatus;

    if (!apiResponse.success) {
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('Access denied') ||
        apiResponse.message?.includes('access denied')) {
        status = 403; // Forbidden
      } else if (apiResponse.message?.includes('required') ||
        apiResponse.message?.includes('limit reached')) {
        status = 400; // Bad Request
      } else {
        status = 500; // Internal Server Error
      }
    }

    return new Response(JSON.stringify(apiResponse), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Export singleton instance
import { chartService } from '../services/ChartService';
export const chartController = new ChartController(chartService);
