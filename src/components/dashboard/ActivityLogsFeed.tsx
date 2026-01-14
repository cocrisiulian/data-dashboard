/**
 * Activity Logs Feed Component
 * Real-time activity logs with polling every 5 seconds
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Badge } from '@/components/ui/text/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/controls/button';

interface ActivityLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  level: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export function ActivityLogsFeed() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/logs?limit=10');
      if (!response.ok) throw new Error('Failed to fetch logs');
      
      const { data } = await response.json();
      setLogs(data);
      setLastUpdate(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'bg-red-500';
      case 'WARN': return 'bg-yellow-500';
      case 'INFO': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              Real-time system activity • Updates every 5s
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-4">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {logs.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              No activity logs yet
            </div>
          )}

          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <Badge className={getLevelColor(log.level)}>
                  {log.level}
                </Badge>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm truncate">
                      {log.action}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {getRelativeTime(log.createdAt)}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">{log.entity}</span>
                    {log.entityId && (
                      <span className="text-xs ml-2">ID: {log.entityId.slice(0, 8)}...</span>
                    )}
                  </div>

                  {log.user && (
                    <div className="text-xs text-muted-foreground mt-1">
                      by {log.user.fullName || log.user.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
