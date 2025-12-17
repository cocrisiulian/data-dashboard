/**
 * Dashboards API Route - Next.js App Router
 * Locație: src/app/api/dashboards/route.ts
 * 
 * Folosește:
 * - src/server/controllers/DashboardController.ts (HTTP handling)
 * - src/server/services/DashboardService.ts (business logic)
 * - src/server/repositories/DashboardRepository.ts (data access)
 * - src/server/infrastructure/container.ts (dependency injection)
 * 
 * Endpoints:
 * - GET    /api/dashboards - Get all dashboards for logged user
 * - POST   /api/dashboards - Create new dashboard
 * 
 * Arhitectură:
 * Request → Next.js Route → Controller → Service → Repository → Database
 * Response ← Next.js Route ← Controller ← Service ← Repository ← Database
 */

import { NextRequest, NextResponse } from 'next/server';
import { dashboardController } from '@/server/controllers/DashboardController';
import { DashboardController } from '@/server/controllers/DashboardController';

/**
 * GET /api/dashboards
 * Get all dashboards for logged user
 * 
 * Exemplu Response (200 OK):
 * {
 *   "success": true,
 *   "count": 2,
 *   "data": [
 *     {
 *       "id": "dashboard-uuid-1",
 *       "name": "Sales Dashboard",
 *       "description": "Overview of monthly sales",
 *       "created_at": "2025-12-10T10:00:00Z",
 *       "updated_at": "2025-12-10T10:00:00Z",
 *       "user_id": "user-uuid",
 *       "_count": { "charts": 5 },
 *       "charts": [
 *         {
 *           "id": "chart-uuid-1",
 *           "title": "Sales by Month",
 *           "chart_type": "bar"
 *         },
 *         ...
 *       ]
 *     },
 *     ...
 *   ]
 * }
 * 
 * Response (401 Unauthorized):
 * {
 *   "success": false,
 *   "message": "Authentication required"
 * }
 * 
 * Folosit în:
 * - src/app/dashboard/page.tsx (dashboard listing)
 * - src/components/dashboard/dashboard-grid.tsx
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const apiResponse = await dashboardController.getAllDashboards(userId);
    return DashboardController.toNextResponse(apiResponse, 200);
  } catch (error) {
    console.error('[API Route] GET /api/dashboards error:', error);
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
 * POST /api/dashboards
 * Create new dashboard
 * 
 * Request Body:
 * {
 *   "name": "Marketing Dashboard",
 *   "description": "Campaign performance metrics"  // optional
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "Dashboard created successfully",
 *   "data": {
 *     "id": "dashboard-uuid-new",
 *     "name": "Marketing Dashboard",
 *     "description": "Campaign performance metrics",
 *     "created_at": "2025-12-12T15:30:00Z",
 *     "updated_at": "2025-12-12T15:30:00Z",
 *     "user_id": "user-uuid"
 *   }
 * }
 * 
 * Response (400 Bad Request):
 * {
 *   "success": false,
 *   "message": "Dashboard limit reached (2 dashboards for Free plan)"
 * }
 * 
 * Response (400 Bad Request):
 * {
 *   "success": false,
 *   "message": "Dashboard name is required"
 * }
 * 
 * Validări (în DashboardService):
 * - User has not reached plan dashboard limit
 * - Name is not empty
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Dashboard name is required' },
        { status: 400 }
      );
    }

    const dashboardData = {
      name: name.trim(),
      description: description || null
    };

    const apiResponse = await dashboardController.createDashboard(userId, dashboardData);
    
    if (apiResponse.success) {
      return DashboardController.toNextResponse(apiResponse, 201);
    } else {
      // Handle business logic errors (e.g., limit reached)
      return DashboardController.toNextResponse(apiResponse, 400);
    }
  } catch (error) {
    console.error('[API Route] POST /api/dashboards error:', error);
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
