/**
 * Admin Analytics API Route - Recent Users
 * Endpoint: GET /api/admin/analytics/recent-users?limit=10
 * Protected: Admin only
 * 
 * Query Params:
 * - limit: number (default: 10) - number of users to return
 * 
 * Returns: Array of recently registered users
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { AdminStatsService } from '@/server/services/AdminStatsService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const adminStatsService = resolveDependency<AdminStatsService>('adminStatsService');
    const recentUsers = await adminStatsService.getRecentUsers(limit);

    return NextResponse.json({
      success: true,
      data: recentUsers
    });
  } catch (error: any) {
    console.error('Failed to fetch recent users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recent users',
        message: error.message
      },
      { status: 500 }
    );
  }
}
