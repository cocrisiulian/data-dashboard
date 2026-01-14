/**
 * Admin KPI Card Component
 * Used for displaying statistics (Total Users, Dashboards, Files, Charts)
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { LucideIcon } from 'lucide-react';

interface AdminStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function AdminStatsCard({
  title, 
  value, 
  icon: Icon, 
  description,
  trend 
}: AdminStatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}% from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
