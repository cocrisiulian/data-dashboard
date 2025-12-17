/**
 * Charts API Route - Next.js App Router
 * Locație: src/app/api/charts/route.ts
 * 
 * Folosește:
 * - src/server/controllers/ChartController.ts (HTTP handling)
 * - src/server/services/ChartService.ts (business logic)
 * - src/server/repositories/ChartRepository.ts (data access)
 * - src/server/infrastructure/container.ts (dependency injection)
 * 
 * Endpoints:
 * - GET    /api/charts?dashboardId=:id - Get charts by dashboard
 * - POST   /api/charts                 - Create new chart
 * 
 * Arhitectură:
 * Request → Next.js Route → Controller → Service → Repository → Database
 * Response ← Next.js Route ← Controller ← Service ← Repository ← Database
 */

import { NextRequest, NextResponse } from 'next/server';
import { chartController } from '@/server/controllers/ChartController';
import { ChartController } from '@/server/controllers/ChartController';

/**
 * GET /api/charts?dashboardId=uuid-1
 * Get all charts for a specific dashboard
 * 
 * Query Parameters:
 * - dashboardId: string (required) - UUID of the dashboard
 * 
 * Exemplu Response (200 OK):
 * {
 *   "success": true,
 *   "count": 3,
 *   "data": [
 *     {
 *       "id": "chart-uuid-1",
 *       "title": "Sales Overview",
 *       "chart_type": "bar",
 *       "configuration": { "xAxis": "month", "yAxis": "sales" },
 *       "created_at": "2025-12-10T10:00:00Z",
 *       "updated_at": "2025-12-10T10:00:00Z",
 *       "dashboard_id": "uuid-1",
 *       "file_id": "file-uuid-1",
 *       "file": {
 *         "id": "file-uuid-1",
 *         "original_name": "sales-data.csv"
 *       }
 *     },
 *     ...
 *   ]
 * }
 * 
 * Response (400 Bad Request):
 * {
 *   "success": false,
 *   "message": "Dashboard ID is required"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to access this dashboard"
 * }
 * 
 * Folosit în:
 * - src/app/dashboard/[id]/page.tsx (chart rendering)
 * - src/components/dashboard/dashboard-view.tsx
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

    const { searchParams } = new URL(request.url);
    const dashboardId = searchParams.get('dashboardId');

    if (!dashboardId) {
      return NextResponse.json(
        { success: false, message: 'Dashboard ID is required' },
        { status: 400 }
      );
    }

    const apiResponse = await chartController.getChartsByDashboard(dashboardId, userId);
    
    if (apiResponse.success) {
      return ChartController.toNextResponse(apiResponse, 200);
    } else {
      // Handle not found or forbidden
      const status = apiResponse.message?.includes('permission') ? 403 : 404;
      return ChartController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error('[API Route] GET /api/charts error:', error);
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
 * POST /api/charts
 * Create new chart
 * 
 * Request Body:
 * {
 *   "title": "Sales Chart",
 *   "chartType": "bar",
 *   "configuration": { "xAxis": "month", "yAxis": "sales" },
 *   "dashboardId": "uuid-1",
 *   "fileId": "file-uuid-1"  // optional
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "Chart created successfully",
 *   "data": {
 *     "id": "chart-uuid-new",
 *     "title": "Sales Chart",
 *     "chart_type": "bar",
 *     "configuration": { "xAxis": "month", "yAxis": "sales" },
 *     "created_at": "2025-12-12T15:30:00Z",
 *     "updated_at": "2025-12-12T15:30:00Z",
 *     "dashboard_id": "uuid-1",
 *     "file_id": "file-uuid-1"
 *   }
 * }
 * 
 * Response (400 Bad Request):
 * {
 *   "success": false,
 *   "message": "Chart limit reached (10 charts for Free plan)"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to add charts to this dashboard"
 * }
 * 
 * Validări (în ChartService):
 * - User owns the dashboard (via dashboard ownership check)
 * - User has not reached plan chart limit
 * - Dashboard exists
 * - File exists (if fileId provided)
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
    const { title, chartType, configuration, dashboardId, fileId } = body;

    if (!title || !chartType || !dashboardId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: title, chartType, dashboardId' 
        },
        { status: 400 }
      );
    }

    const chartData = {
      title,
      chartType,
      chartConfig: configuration || {},
      dashboardId,
      fileId: fileId || null
    };

    const apiResponse = await chartController.createChart(userId, chartData);
    
    if (apiResponse.success) {
      return ChartController.toNextResponse(apiResponse, 201);
    } else {
      // Handle business logic errors
      let status = 400;
      if (apiResponse.message?.includes('permission')) {
        status = 403;
      } else if (apiResponse.message?.includes('limit')) {
        status = 400;
      }
      
      return ChartController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error('[API Route] POST /api/charts error:', error);
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
