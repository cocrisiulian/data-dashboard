/**
 * Admin Charts Grid Component
 * Displays 4 analytics charts: User Growth, Dashboards by Plan, Chart Types, Activity Timeline
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface AdminChartsGridProps {
  onRefresh?: () => void;
}

export function AdminChartsGrid({ onRefresh }: AdminChartsGridProps) {
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [dashboardsByPlan, setDashboardsByPlan] = useState<any[]>([]);
  const [chartTypes, setChartTypes] = useState<any[]>([]);
  const [activityTimeline, setActivityTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChartsData = async () => {
    setIsLoading(true);
    try {
      const [growth, plans, types, timeline] = await Promise.all([
        fetch('/api/admin/analytics/user-growth?days=30').then(r => r.json()),
        fetch('/api/admin/analytics/dashboards-by-plan').then(r => r.json()),
        fetch('/api/admin/analytics/chart-types').then(r => r.json()),
        fetch('/api/admin/analytics/activity-timeline?days=7').then(r => r.json())
      ]);

      setUserGrowth(growth.data || []);
      setDashboardsByPlan(plans.data || []);
      setChartTypes(types.data || []);
      setActivityTimeline(timeline.data || []);
    } catch (error) {
      console.error('Failed to fetch charts data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData();
  }, []);

  // Expose refresh to parent
  useEffect(() => {
    if (onRefresh) {
      (window as any).__adminChartsRefresh = fetchChartsData;
    }
  }, [onRefresh]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                name="New Users"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Dashboards by Plan Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboards by Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardsByPlan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="planName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Dashboards" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartTypes}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.type}: ${entry.count}`}
              >
                {chartTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="INFO" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Info"
              />
              <Area 
                type="monotone" 
                dataKey="WARN" 
                stackId="1"
                stroke="#ffc658" 
                fill="#ffc658" 
                name="Warning"
              />
              <Area 
                type="monotone" 
                dataKey="ERROR" 
                stackId="1"
                stroke="#ff8042" 
                fill="#ff8042" 
                name="Error"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
