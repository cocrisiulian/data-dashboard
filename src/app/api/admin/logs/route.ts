/**
 * Admin Activity Logs API Route
 * Endpoint: GET /api/admin/logs?limit=10&level=INFO
 * Protected: Admin only
 * 
 * Query Params:
 * - limit: number (default: 10) - number of logs to return
 * - level: string (optional) - filter by level (INFO, WARN, ERROR)
 * 
 * Returns: Array of recent activity logs with user info
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { ActivityLogService } from '@/server/services/ActivityLogService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const level = searchParams.get('level') || undefined;

    const activityLogService = resolveDependency<ActivityLogService>('activityLogService');
    const logs = await activityLogService.getRecentLogs(limit, level);

    return NextResponse.json({
      success: true,
      data: logs
    });
  } catch (error: any) {
    console.error('Failed to fetch activity logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch activity logs',
        message: error.message
      },
      { status: 500 }
    );
  }
}
