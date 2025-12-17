/**
 * DashboardController - Presentation/HTTP Layer pentru Dashboards
 * Locație: src/server/controllers/DashboardController.ts
 * 
 * Folosit în:
 * - src/app/api/dashboards/route.ts
 * - src/app/api/dashboards/[id]/route.ts
 * 
 * Flow: API Route → DashboardController → DashboardService → DashboardRepository → DB
 */

import { DashboardService, DashboardDTO } from '../services/DashboardService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export class DashboardController {
  private dashboardService: DashboardService;

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
  }

  /**
   * GET /api/dashboards
   * Get all dashboards pentru authenticated user
   * 
   * Response: 200 OK
   * {
   *   "success": true,
   *   "count": 3,
   *   "data": [
   *     {
   *       "id": "...",
   *       "name": "Sales Dashboard",
   *       "description": "Monthly sales analytics",
   *       "charts": [...]
   *     }
   *   ]
   * }
   */
  async getAllDashboards(userId: string): Promise<ApiResponse<DashboardDTO[]>> {
    try {
      const dashboards = await this.dashboardService.getAllDashboards(userId);
      
      return {
        success: true,
        count: dashboards.length,
        data: dashboards
      };
    } catch (error) {
      console.error('[DashboardController] Error in getAllDashboards:', error);
      return {
        success: false,
        message: 'Error fetching dashboards',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * GET /api/dashboards/:id
   * Get single dashboard cu toate charts
   * 
   * Response: 200 OK sau 404 Not Found
   */
  async getDashboardById(dashboardId: string, userId: string): Promise<ApiResponse<DashboardDTO>> {
    try {
      const dashboard = await this.dashboardService.getDashboardById(dashboardId, userId);
      
      return {
        success: true,
        data: dashboard
      };
    } catch (error) {
      console.error('[DashboardController] Error in getDashboardById:', error);
      
      if (error instanceof Error && error.message === 'Dashboard not found') {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: 'Error fetching dashboard',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * POST /api/dashboards
   * Create new dashboard
   * 
   * Request Body:
   * {
   *   "name": "Sales Dashboard",
   *   "description": "Monthly sales analytics"
   * }
   * 
   * Response: 201 Created sau 403 Forbidden (limit)
   */
  async createDashboard(
    userId: string,
    dashboardData: {
      name: string;
      description?: string;
    }
  ): Promise<ApiResponse<DashboardDTO>> {
    try {
      // Basic validation
      if (!dashboardData.name) {
        return {
          success: false,
          message: 'Dashboard name is required'
        };
      }

      const dashboard = await this.dashboardService.createDashboard(userId, dashboardData);
      
      return {
        success: true,
        message: 'Dashboard created successfully',
        data: dashboard
      };
    } catch (error) {
      console.error('[DashboardController] Error in createDashboard:', error);
      
      // Handle plan limit errors
      if (error instanceof Error && error.message.includes('limit reached')) {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: 'Error creating dashboard',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * PUT /api/dashboards/:id
   * Update existing dashboard
   * 
   * Request Body (partial):
   * {
   *   "name": "Updated Dashboard Name",
   *   "description": "New description"
   * }
   * 
   * Response: 200 OK sau 404 Not Found
   */
  async updateDashboard(
    dashboardId: string,
    userId: string,
    updateData: Partial<{
      name: string;
      description: string;
    }>
  ): Promise<ApiResponse<DashboardDTO>> {
    try {
      const dashboard = await this.dashboardService.updateDashboard(
        dashboardId,
        userId,
        updateData
      );
      
      return {
        success: true,
        message: 'Dashboard updated successfully',
        data: dashboard
      };
    } catch (error) {
      console.error('[DashboardController] Error in updateDashboard:', error);
      
      if (error instanceof Error && error.message === 'Dashboard not found') {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: 'Error updating dashboard',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * DELETE /api/dashboards/:id
   * Delete dashboard (cascade delete toate charts)
   * 
   * Response: 200 OK sau 404 Not Found
   */
  async deleteDashboard(dashboardId: string, userId: string): Promise<ApiResponse> {
    try {
      await this.dashboardService.deleteDashboard(dashboardId, userId);
      
      return {
        success: true,
        message: 'Dashboard deleted successfully'
      };
    } catch (error) {
      console.error('[DashboardController] Error in deleteDashboard:', error);
      
      if (error instanceof Error && error.message === 'Dashboard not found') {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: 'Error deleting dashboard',
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
      } else if (apiResponse.message?.includes('limit reached')) {
        status = 403; // Forbidden
      } else if (apiResponse.message?.includes('required')) {
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
import { dashboardService } from '../services/DashboardService';
export const dashboardController = new DashboardController(dashboardService);
