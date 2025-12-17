/**
 * Chart by ID API Route - Next.js App Router
 * Locație: src/app/api/charts/[id]/route.ts
 * 
 * Folosește:
 * - src/server/controllers/ChartController.ts
 * - src/server/services/ChartService.ts
 * - src/server/repositories/ChartRepository.ts
 * 
 * Endpoints:
 * - GET    /api/charts/:id - Get chart by ID
 * - PUT    /api/charts/:id - Update chart
 * - DELETE /api/charts/:id - Delete chart
 */

import { NextRequest, NextResponse } from 'next/server';
import { chartController } from '@/server/controllers/ChartController';
import { ChartController } from '@/server/controllers/ChartController';

/**
 * GET /api/charts/:id
 * Get chart by ID
 * 
 * Exemplu: GET /api/charts/chart-uuid-1
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "chart-uuid-1",
 *     "title": "Sales Overview",
 *     "chart_type": "bar",
 *     "configuration": { "xAxis": "month", "yAxis": "sales" },
 *     "created_at": "2025-12-10T10:00:00Z",
 *     "updated_at": "2025-12-10T10:00:00Z",
 *     "dashboard_id": "uuid-1",
 *     "file_id": "file-uuid-1",
 *     "file": {
 *       "id": "file-uuid-1",
 *       "original_name": "sales-data.csv",
 *       "file_path": "/uploads/user-id/sales-data.csv"
 *     }
 *   }
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "Chart not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to access this chart"
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

    const chartId = params.id;
    const apiResponse = await chartController.getChartById(chartId, userId);
    
    if (apiResponse.success) {
      return ChartController.toNextResponse(apiResponse, 200);
    } else {
      // Handle not found or forbidden
      const status = apiResponse.message?.includes('not found') ? 404 : 403;
      return ChartController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] GET /api/charts/${params.id} error:`, error);
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
 * PUT /api/charts/:id
 * Update chart
 * 
 * Exemplu: PUT /api/charts/chart-uuid-1
 * 
 * Request Body (partial updates supported):
 * {
 *   "title": "Updated Sales Chart",
 *   "chartType": "line",
 *   "configuration": { "xAxis": "month", "yAxis": "revenue" }
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Chart updated successfully",
 *   "data": {
 *     "id": "chart-uuid-1",
 *     "title": "Updated Sales Chart",
 *     "chart_type": "line",
 *     "configuration": { "xAxis": "month", "yAxis": "revenue" },
 *     "updated_at": "2025-12-12T15:45:00Z"
 *   }
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "Chart not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to update this chart"
 * }
 * 
 * Validări (în ChartService):
 * - User owns the dashboard containing this chart
 * - Chart exists
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

    const chartId = params.id;
    const body = await request.json();
    const { title, chartType, configuration, fileId } = body;

    // Build update data (only include provided fields)
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (chartType !== undefined) updateData.chartType = chartType;
    if (configuration !== undefined) updateData.chartConfig = configuration;
    if (fileId !== undefined) updateData.fileId = fileId;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    const apiResponse = await chartController.updateChart(chartId, userId, updateData);
    
    if (apiResponse.success) {
      return ChartController.toNextResponse(apiResponse, 200);
    } else {
      // Handle not found or forbidden
      let status = 400;
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('permission')) {
        status = 403;
      }
      
      return ChartController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] PUT /api/charts/${params.id} error:`, error);
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
 * DELETE /api/charts/:id
 * Delete chart
 * 
 * Exemplu: DELETE /api/charts/chart-uuid-1
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Chart deleted successfully"
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "Chart not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to delete this chart"
 * }
 * 
 * Business Logic (în ChartService):
 * - Check chart ownership via dashboard
 * - Delete from database (no cascade effects)
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

    const chartId = params.id;
    const apiResponse = await chartController.deleteChart(chartId, userId);
    
    if (apiResponse.success) {
      return ChartController.toNextResponse(apiResponse, 200);
    } else {
      // Determine status code based on error type
      let status = 400;
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('permission')) {
        status = 403;
      }
      
      return ChartController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] DELETE /api/charts/${params.id} error:`, error);
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
