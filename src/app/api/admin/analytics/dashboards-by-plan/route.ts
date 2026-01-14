/**
 * Admin Analytics API Route - Dashboards by Plan
 * Endpoint: GET /api/admin/analytics/dashboards-by-plan
 * Protected: Admin only
 * 
 * Returns: Array of { planName: string, count: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { AdminStatsService } from '@/server/services/AdminStatsService';

export async function GET(request: NextRequest) {
  try {
    const adminStatsService = resolveDependency<AdminStatsService>('adminStatsService');
    const dashboardsByPlan = await adminStatsService.getDashboardsByPlan();

    return NextResponse.json({
      success: true,
      data: dashboardsByPlan
    });
  } catch (error: any) {
    console.error('Failed to fetch dashboards by plan:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboards by plan',
        message: error.message
      },
      { status: 500 }
    );
  }
}
