/**
 * PlanController - Presentation/HTTP Layer
 * Locație: src/server/controllers/PlanController.ts
 * 
 * Folosit în:
 * - src/app/api/plans/route.ts (Next.js API Routes)
 * - labs_api/routes/plans.js (Express standalone server)
 * - LABORATOR_PREDARE/LAB10 (exemplu Controller cu DI)
 * 
 * Responsabilități:
 * - HTTP request/response handling
 * - Request validation (basic structure)
 * - Delegating la Service Layer
 * - Response formatting (JSON, status codes)
 * - Error handling și HTTP errors
 * - NO business logic (totul în Service)
 */

import { PlanService } from '../services/PlanService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export class PlanController {
  private planService: PlanService;

  /**
   * Constructor cu Dependency Injection
   * @param planService - Injectat business service
   */
  constructor(planService: PlanService) {
    this.planService = planService;
  }

  /**
   * GET /api/plans
   * Get all plans
   * 
   * Response: 200 OK
   * {
   *   "success": true,
   *   "count": 3,
   *   "data": [...]
   * }
   */
  async getAllPlans(): Promise<ApiResponse> {
    try {
      const plans = await this.planService.getAllPlans();

      return {
        success: true,
        count: plans.length,
        data: plans
      };
    } catch (error) {
      console.error('[PlanController] Error in getAllPlans:', error);
      return {
        success: false,
        message: 'Error fetching plans',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * GET /api/plans/:id
   * Get plan by ID
   * 
   * Response: 200 OK sau 404 Not Found
   */
  async getPlanById(planId: string): Promise<ApiResponse> {
    try {
      const plan = await this.planService.getPlanById(planId);

      return {
        success: true,
        data: plan
      };
    } catch (error) {
      console.error('[PlanController] Error in getPlanById:', error);

      if (error instanceof Error && error.message === 'Plan not found') {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error fetching plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * POST /api/plans
   * Create new plan
   * 
   * Request Body:
   * {
   *   "name": "Enterprise",
   *   "maxFiles": 500,
   *   "maxCharts": 1000,
   *   "maxDashboards": 50,
   *   "price": 99.99
   * }
   * 
   * Response: 201 Created sau 400 Bad Request
   */
  async createPlan(planData: {
    name: string;
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
    price: number;
  }): Promise<ApiResponse> {
    try {
      // Basic request validation
      if (!planData.name) {
        return {
          success: false,
          message: 'Plan name is required'
        };
      }

      const newPlan = await this.planService.createPlan(planData);

      return {
        success: true,
        data: newPlan,
        message: 'Plan created successfully'
      };
    } catch (error) {
      console.error('[PlanController] Error in createPlan:', error);

      // Handle business validation errors
      if (error instanceof Error && error.message.includes('already exists')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error creating plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * PUT /api/plans/:id
   * Update existing plan
   * 
   * Request Body (partial update):
   * {
   *   "price": 89.99,
   *   "maxFiles": 1000
   * }
   * 
   * Response: 200 OK sau 404 Not Found sau 400 Bad Request
   */
  async updatePlan(planId: string, updateData: Partial<{
    name: string;
    maxFiles: number;
    maxCharts: number;
    maxDashboards: number;
    price: number;
  }>): Promise<ApiResponse> {
    try {
      const updatedPlan = await this.planService.updatePlan(planId, updateData);

      return {
        success: true,
        data: updatedPlan,
        message: 'Plan updated successfully'
      };
    } catch (error) {
      console.error('[PlanController] Error in updatePlan:', error);

      if (error instanceof Error && error.message === 'Plan not found') {
        return {
          success: false,
          message: error.message
        };
      }

      // Handle business rule violations
      if (error instanceof Error && error.message.includes('would exceed limit')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error updating plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * DELETE /api/plans/:id
   * Delete plan
   * 
   * Response: 200 OK sau 404 Not Found sau 409 Conflict
   */
  async deletePlan(planId: string): Promise<ApiResponse> {
    try {
      await this.planService.deletePlan(planId);

      return {
        success: true,
        message: 'Plan deleted successfully'
      };
    } catch (error) {
      console.error('[PlanController] Error in deletePlan:', error);

      if (error instanceof Error && error.message === 'Plan not found') {
        return {
          success: false,
          message: error.message
        };
      }

      // Handle business rule: cannot delete if users exist
      if (error instanceof Error && error.message.includes('subscribed')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Error deleting plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Helper: Convert controller response to Next.js Response
   * Folosit în: src/app/api/plans/route.ts
   */
  static toNextResponse(apiResponse: ApiResponse, defaultStatus: number = 200): Response {
    let status = defaultStatus;

    if (!apiResponse.success) {
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('already exists') ||
        apiResponse.message?.includes('subscribed')) {
        status = 409; // Conflict
      } else if (apiResponse.message?.includes('required') ||
        apiResponse.message?.includes('exceed limit')) {
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

// Export singleton instance pentru production usage
import { planService } from '../services/PlanService';
export const planController = new PlanController(planService);
