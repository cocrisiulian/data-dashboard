/**
 * Dashboard by ID API Route - Next.js App Router
 * Locație: src/app/api/dashboards/[id]/route.ts
 * 
 * Folosește:
 * - src/server/controllers/DashboardController.ts
 * - src/server/services/DashboardService.ts
 * - src/server/repositories/DashboardRepository.ts
 * 
 * Endpoints:
 * - GET    /api/dashboards/:id - Get dashboard by ID
 * - PUT    /api/dashboards/:id - Update dashboard
 * - DELETE /api/dashboards/:id - Delete dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { dashboardController } from '@/server/controllers/DashboardController';
import { DashboardController } from '@/server/controllers/DashboardController';

/**
 * GET /api/dashboards/:id
 * Get dashboard by ID with all charts
 * 
 * Exemplu: GET /api/dashboards/dashboard-uuid-1
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "dashboard-uuid-1",
 *     "name": "Sales Dashboard",
 *     "description": "Overview of monthly sales",
 *     "created_at": "2025-12-10T10:00:00Z",
 *     "updated_at": "2025-12-10T10:00:00Z",
 *     "user_id": "user-uuid",
 *     "_count": { "charts": 5 },
 *     "charts": [
 *       {
 *         "id": "chart-uuid-1",
 *         "title": "Sales by Month",
 *         "chart_type": "bar",
 *         "configuration": { "xAxis": "month", "yAxis": "sales" },
 *         "file": {
 *           "id": "file-uuid-1",
 *           "original_name": "sales-data.csv"
 *         }
 *       },
 *       ...
 *     ]
 *   }
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "Dashboard not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to access this dashboard"
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const dashboardId = params.id;
    const apiResponse = await dashboardController.getDashboardById(dashboardId, userId);
    
    if (apiResponse.success) {
      return DashboardController.toNextResponse(apiResponse, 200);
    } else {
      // Handle not found or forbidden
      const status = apiResponse.message?.includes('not found') ? 404 : 403;
      return DashboardController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] GET /api/dashboards/${params.id} error:`, error);
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
 * PUT /api/dashboards/:id
 * Update dashboard
 * 
 * Exemplu: PUT /api/dashboards/dashboard-uuid-1
 * 
 * Request Body (partial updates supported):
 * {
 *   "name": "Updated Sales Dashboard",
 *   "description": "Updated description"
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Dashboard updated successfully",
 *   "data": {
 *     "id": "dashboard-uuid-1",
 *     "name": "Updated Sales Dashboard",
 *     "description": "Updated description",
 *     "updated_at": "2025-12-12T15:45:00Z"
 *   }
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "Dashboard not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to update this dashboard"
 * }
 * 
 * Validări (în DashboardService):
 * - User owns the dashboard
 * - Dashboard exists
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const dashboardId = params.id;
    const body = await request.json();
    const { name, description } = body;

    // Build update data (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) {
      if (name.trim() === '') {
        return NextResponse.json(
          { success: false, message: 'Dashboard name cannot be empty' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    const apiResponse = await dashboardController.updateDashboard(dashboardId, userId, updateData);
    
    if (apiResponse.success) {
      return DashboardController.toNextResponse(apiResponse, 200);
    } else {
      // Handle not found or forbidden
      let status = 400;
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('permission')) {
        status = 403;
      }
      
      return DashboardController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] PUT /api/dashboards/${params.id} error:`, error);
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
 * DELETE /api/dashboards/:id
 * Delete dashboard and all associated charts
 * 
 * Exemplu: DELETE /api/dashboards/dashboard-uuid-1
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Dashboard and 5 charts deleted successfully"
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "Dashboard not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to delete this dashboard"
 * }
 * 
 * Business Logic (în DashboardService):
 * - Check dashboard ownership
 * - Cascade delete all charts associated with dashboard
 * - Delete dashboard from database
 * - Return count of deleted charts in success message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const dashboardId = params.id;
    const apiResponse = await dashboardController.deleteDashboard(dashboardId, userId);
    
    if (apiResponse.success) {
      return DashboardController.toNextResponse(apiResponse, 200);
    } else {
      // Determine status code based on error type
      let status = 400;
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('permission')) {
        status = 403;
      }
      
      return DashboardController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] DELETE /api/dashboards/${params.id} error:`, error);
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
