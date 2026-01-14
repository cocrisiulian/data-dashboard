/**
 * Admin Analytics API Route
 * Endpoint: GET /api/admin/analytics/kpis
 * Protected: Admin only (middleware check în middleware.ts)
 * 
 * Returns: KPI statistics (total users, dashboards, files, charts)
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveDependency } from '@/server/infrastructure/container';
import { AdminStatsService } from '@/server/services/AdminStatsService';

export async function GET(request: NextRequest) {
  try {
    const adminStatsService = resolveDependency<AdminStatsService>('adminStatsService');
    const kpis = await adminStatsService.getKPIs();

    return NextResponse.json({
      success: true,
      data: kpis
    });
  } catch (error: any) {
    console.error('Failed to fetch KPIs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch KPIs',
        message: error.message
      },
      { status: 500 }
    );
  }
}
