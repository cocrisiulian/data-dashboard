/**
 * Plan by ID API Route - Next.js App Router
 * Locație: src/app/api/plans/[id]/route.ts
 * 
 * Folosește:
 * - src/server/controllers/PlanController.ts
 * - src/server/services/PlanService.ts
 * - src/server/repositories/PlanRepository.ts
 * 
 * Endpoints:
 * - GET    /api/plans/:id - Get plan by ID
 * - PUT    /api/plans/:id - Update plan
 * - DELETE /api/plans/:id - Delete plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { planController } from '@/server/controllers/PlanController';
import { PlanController } from '@/server/controllers/PlanController';

/**
 * GET /api/plans/:id
 * Get plan by ID
 * 
 * Exemplu: GET /api/plans/1
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "1",
 *     "name": "Free",
 *     "price": 0,
 *     "maxFiles": 5,
 *     "maxCharts": 10,
 *     "maxDashboards": 2,
 *     "canDelete": false,
 *     "upgradeRecommendation": "Consider upgrading to Pro",
 *     "_count": { "users": 15 }
 *   }
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "Plan not found"
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id;
    const apiResponse = await planController.getPlanById(planId);
    return PlanController.toNextResponse(apiResponse, 200);
  } catch (error) {
    console.error(`[API Route] GET /api/plans/${params.id} error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/plans/:id
 * Update plan
 * 
 * Request Body (partial update):
 * {
 *   "price": 89.99,
 *   "maxFiles": 1000
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Plan updated successfully",
 *   "data": {
 *     "id": "3",
 *     "name": "Enterprise",
 *     "price": 89.99,
 *     "maxFiles": 1000,
 *     "maxCharts": 1000,
 *     "maxDashboards": 50,
 *     "updatedAt": "2025-12-10T11:00:00Z"
 *   }
 * }
 * 
 * Errors:
 * - 404 Not Found: Plan nu există
 * - 400 Bad Request: Users would exceed new limits
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id;
    const body = await request.json();
    
    // Prepare update data (support both camelCase și snake_case)
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.maxFiles !== undefined || body.max_files !== undefined) {
      updateData.maxFiles = parseInt(body.maxFiles || body.max_files);
    }
    if (body.maxCharts !== undefined || body.max_charts !== undefined) {
      updateData.maxCharts = parseInt(body.maxCharts || body.max_charts);
    }
    if (body.maxDashboards !== undefined || body.max_dashboards !== undefined) {
      updateData.maxDashboards = parseInt(body.maxDashboards || body.max_dashboards);
    }
    if (body.price !== undefined) {
      updateData.price = parseFloat(body.price);
    }

    const apiResponse = await planController.updatePlan(planId, updateData);
    return PlanController.toNextResponse(apiResponse, 200);
  } catch (error) {
    console.error(`[API Route] PUT /api/plans/${params.id} error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Invalid request body',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/plans/:id
 * Delete plan
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Plan deleted successfully"
 * }
 * 
 * Response (409 Conflict):
 * {
 *   "success": false,
 *   "message": "Cannot delete plan 'Pro'. 25 user(s) subscribed. Migrate users first."
 * }
 * 
 * Errors:
 * - 404 Not Found: Plan nu există
 * - 409 Conflict: Plan are useri subscribed
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id;
    const apiResponse = await planController.deletePlan(planId);
    return PlanController.toNextResponse(apiResponse, 200);
  } catch (error) {
    console.error(`[API Route] DELETE /api/plans/${params.id} error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Exemplu folosire în frontend:
 * 
 * // Get plan by ID
 * const plan = await fetch('/api/plans/1').then(r => r.json());
 * 
 * // Update plan
 * const updated = await fetch('/api/plans/3', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ price: 89.99 })
 * });
 * 
 * // Delete plan
 * const deleted = await fetch('/api/plans/4', {
 *   method: 'DELETE'
 * });
 */
