/**
 * Plans API Route - Next.js App Router
 * Locație: src/app/api/plans/route.ts
 * 
 * Folosește:
 * - src/server/controllers/PlanController.ts (HTTP handling)
 * - src/server/services/PlanService.ts (business logic)
 * - src/server/repositories/PlanRepository.ts (data access)
 * - src/server/infrastructure/container.ts (dependency injection)
 * 
 * Endpoints:
 * - GET    /api/plans          - Get all plans
 * - POST   /api/plans          - Create new plan
 * - GET    /api/plans/:id      - Get plan by ID
 * - PUT    /api/plans/:id      - Update plan
 * - DELETE /api/plans/:id      - Delete plan
 * 
 * Arhitectură:
 * Request → Next.js Route → Controller → Service → Repository → Database
 * Response ← Next.js Route ← Controller ← Service ← Repository ← Database
 */

import { NextRequest, NextResponse } from 'next/server';
import { planController } from '@/server/controllers/PlanController';
import { PlanController } from '@/server/controllers/PlanController';

/**
 * GET /api/plans
 * Get all plans
 * 
 * Exemplu Response (200 OK):
 * {
 *   "success": true,
 *   "count": 3,
 *   "data": [
 *     {
 *       "id": "1",
 *       "name": "Free",
 *       "price": 0,
 *       "maxFiles": 5,
 *       "maxCharts": 10,
 *       "maxDashboards": 2,
 *       "isPopular": false,
 *       "valueScore": 17.0,
 *       "displayName": "Free Plan"
 *     },
 *     ...
 *   ]
 * }
 * 
 * Folosit în:
 * - src/app/pricing/page.tsx (afișare planuri)
 * - src/components/dashboard/plan-upgrade-card.tsx
 */
export async function GET(request: NextRequest) {
  try {
    const apiResponse = await planController.getAllPlans();
    return PlanController.toNextResponse(apiResponse, 200);
  } catch (error) {
    console.error('[API Route] GET /api/plans error:', error);
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
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "Plan created successfully",
 *   "data": {
 *     "id": "4",
 *     "name": "Enterprise",
 *     "maxFiles": 500,
 *     "maxCharts": 1000,
 *     "maxDashboards": 50,
 *     "price": 99.99,
 *     "createdAt": "2025-12-10T10:30:00Z",
 *     "updatedAt": "2025-12-10T10:30:00Z"
 *   }
 * }
 * 
 * Errors:
 * - 400 Bad Request: Missing required fields
 * - 409 Conflict: Plan name already exists
 * - 500 Internal Server Error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract plan data from request
    const planData = {
      name: body.name,
      maxFiles: parseInt(body.maxFiles || body.max_files),
      maxCharts: parseInt(body.maxCharts || body.max_charts),
      maxDashboards: parseInt(body.maxDashboards || body.max_dashboards),
      price: parseFloat(body.price)
    };

    const apiResponse = await planController.createPlan(planData);
    
    // Return 201 Created sau error status
    const status = apiResponse.success ? 201 : 400;
    return PlanController.toNextResponse(apiResponse, status);
  } catch (error) {
    console.error('[API Route] POST /api/plans error:', error);
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
 * Exemplu folosire în frontend:
 * 
 * // Get all plans
 * const response = await fetch('/api/plans');
 * const { data: plans } = await response.json();
 * 
 * // Create new plan
 * const newPlan = await fetch('/api/plans', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'Enterprise',
 *     maxFiles: 500,
 *     maxCharts: 1000,
 *     maxDashboards: 50,
 *     price: 99.99
 *   })
 * });
 * 
 * if (newPlan.ok) {
 *   const { data } = await newPlan.json();
 *   console.log('Plan created:', data);
 * }
 */
