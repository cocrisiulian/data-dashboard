/**
 * Admin Analytics API Route - Top Active Users
 * Endpoint: GET /api/admin/analytics/top-users?limit=10
 * Protected: Admin only
 * 
 * Query Params:
 * - limit: number (default: 10) - number of users to return
 * 
 * Returns: Array of user objects with activity scores
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { AdminStatsService } from '@/server/services/AdminStatsService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const adminStatsService = resolveDependency<AdminStatsService>('adminStatsService');
    const topUsers = await adminStatsService.getTopActiveUsers(limit);

    return NextResponse.json({
      success: true,
      data: topUsers
    });
  } catch (error: any) {
    console.error('Failed to fetch top users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top users',
        message: error.message
      },
      { status: 500 }
    );
  }
}
