/**
 * Admin Analytics API Route - Activity Timeline
 * Endpoint: GET /api/admin/analytics/activity-timeline?days=7
 * Protected: Admin only
 * 
 * Query Params:
 * - days: number (default: 7) - number of days to fetch
 * 
 * Returns: Array of { date: string, INFO: number, WARN: number, ERROR: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { AdminStatsService } from '@/server/services/AdminStatsService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7', 10);

    const adminStatsService = resolveDependency<AdminStatsService>('adminStatsService');
    const timeline = await adminStatsService.getActivityTimeline(days);

    return NextResponse.json({
      success: true,
      data: timeline
    });
  } catch (error: any) {
    console.error('Failed to fetch activity timeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch activity timeline',
        message: error.message
      },
      { status: 500 }
    );
  }
}
