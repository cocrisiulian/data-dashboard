/**
 * Admin Analytics API Route - Chart Types Distribution
 * Endpoint: GET /api/admin/analytics/chart-types
 * Protected: Admin only
 * 
 * Returns: Array of { type: string, count: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { AdminStatsService } from '@/server/services/AdminStatsService';

export async function GET(request: NextRequest) {
  try {
    const adminStatsService = resolveDependency<AdminStatsService>('adminStatsService');
    const chartTypes = await adminStatsService.getChartTypesDistribution();

    return NextResponse.json({
      success: true,
      data: chartTypes
    });
  } catch (error: any) {
    console.error('Failed to fetch chart types:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch chart types',
        message: error.message
      },
      { status: 500 }
    );
  }
}
