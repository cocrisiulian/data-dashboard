/**
 * Admin Analytics API Route - User Growth
 * Endpoint: GET /api/admin/analytics/user-growth?days=30
 * Protected: Admin only
 * 
 * Query Params:
 * - days: number (default: 30) - number of days to fetch
 * 
 * Returns: Array of { date: string, count: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { AdminStatsService } from '@/server/services/AdminStatsService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30', 10);

    const adminStatsService = resolveDependency<AdminStatsService>('adminStatsService');
    const userGrowth = await adminStatsService.getUserGrowth(days);

    return NextResponse.json({
      success: true,
      data: userGrowth
    });
  } catch (error: any) {
    console.error('Failed to fetch user growth:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user growth',
        message: error.message
      },
      { status: 500 }
    );
  }
}
