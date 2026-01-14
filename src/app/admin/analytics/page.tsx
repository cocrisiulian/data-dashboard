/**
 * Admin Analytics Dashboard Page
 * Route: /admin/analytics
 * Protected: Admin only (middleware checks is_admin flag)
 * 
 * Features:
 * - 4 KPI cards (Total Users, Dashboards, Files, Charts)
 * - 4 Charts (User Growth, Dashboards by Plan, Chart Types, Activity Timeline)
 * - 2 Tables (Recent Users, Top Active Users)
 * - Manual refresh button for all statistics
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/controls/button';
import { AdminStatsCard } from '@/components/dashboard/AdminStatsCard';
import { AdminChartsGrid } from '@/components/dashboard/AdminChartsGrid';
import { RecentUsersTable } from '@/components/dashboard/RecentUsersTable';
import { TopUsersTable } from '@/components/dashboard/TopUsersTable';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { RefreshCw, Users, LayoutDashboard, FileText, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KPIStats {
  totalUsers: number;
  totalDashboards: number;
  totalFiles: number;
  totalCharts: number;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<KPIStats>({
    totalUsers: 0,
    totalDashboards: 0,
    totalFiles: 0,
    totalCharts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication and admin status
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.isAdmin) {
        router.push('/admin/unauthorized');
        return;
      }
      setIsAuthenticated(true);
      fetchKPIs();
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchKPIs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/analytics/kpis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        router.push('/admin/unauthorized');
        return;
      }

      const { data } = await response.json();
      setKpis(data);
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Refresh KPIs
      await fetchKPIs();

      // Refresh charts
      if ((window as any).__adminChartsRefresh) {
        await (window as any).__adminChartsRefresh();
      }

      // Refresh tables
      if ((window as any).__recentUsersRefresh) {
        await (window as any).__recentUsersRefresh();
      }
      if ((window as any).__topUsersRefresh) {
        await (window as any).__topUsersRefresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <DashboardNav />
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          <div className="h-12 w-64 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardNav />
      <div className="border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Analytics</h1>
              <p className="text-muted-foreground mt-1">
                System-wide statistics and user activity monitoring
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Statistics
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Users"
            value={kpis.totalUsers}
            icon={Users}
            description="Registered users"
          />
          <AdminStatsCard
            title="Total Dashboards"
            value={kpis.totalDashboards}
            icon={LayoutDashboard}
            description="Created dashboards"
          />
          <AdminStatsCard
            title="Total Files"
            value={kpis.totalFiles}
            icon={FileText}
            description="Uploaded CSV files"
          />
          <AdminStatsCard
            title="Total Charts"
            value={kpis.totalCharts}
            icon={BarChart3}
            description="Generated charts"
          />
        </div>

        {/* Charts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Analytics Charts</h2>
          <AdminChartsGrid onRefresh={handleRefresh} />
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">User Statistics</h2>
          
          <RecentUsersTable />
          <TopUsersTable />
        </div>
      </div>
    </div>
  );
}
