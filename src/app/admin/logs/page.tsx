'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Button } from '@/components/ui/controls/button';
import { Badge } from '@/components/ui/text/badge';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/controls/select';
import { Input } from '@/components/ui/controls/input';
import { Label } from '@/components/ui/text/label';
import { Activity, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [actionFilter, setActionFilter] = useState('all');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, limit, actionFilter, userIdFilter, entityTypeFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      });

      if (actionFilter && actionFilter !== 'all') params.append('action', actionFilter);
      if (userIdFilter) params.append('userId', userIdFilter);
      if (entityTypeFilter && entityTypeFilter !== 'all') params.append('entityType', entityTypeFilter);

      const res = await fetch(`http://localhost:4000/api/admin/logs?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 403) {
          router.push('/admin/unauthorized');
          return;
        }
        throw new Error('Failed to fetch logs');
      }

      const data = await res.json();
      setLogs(data.logs);
      setTotalLogs(data.pagination.total);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setActionFilter('all');
    setUserIdFilter('');
    setEntityTypeFilter('all');
    setCurrentPage(1);
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('CREATED') || action.includes('REGISTERED')) return 'default';
    if (action.includes('UPDATED') || action.includes('UPLOADED')) return 'secondary';
    if (action.includes('DELETED')) return 'destructive';
    if (action.includes('RESTORED')) return 'default';
    return 'outline';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Activity Logs</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Monitor system activity and user actions
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="action">Action Type</Label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger id="action">
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    <SelectItem value="USER_REGISTERED">User Registered</SelectItem>
                    <SelectItem value="FILE_UPLOADED">File Uploaded</SelectItem>
                    <SelectItem value="FILE_SOFT_DELETED">File Deleted</SelectItem>
                    <SelectItem value="FILE_RESTORED">File Restored</SelectItem>
                    <SelectItem value="DASHBOARD_CREATED">Dashboard Created</SelectItem>
                    <SelectItem value="DASHBOARD_UPDATED">Dashboard Updated</SelectItem>
                    <SelectItem value="DASHBOARD_SOFT_DELETED">Dashboard Deleted</SelectItem>
                    <SelectItem value="DASHBOARD_RESTORED">Dashboard Restored</SelectItem>
                    <SelectItem value="PLAN_UPGRADED">Plan Upgraded</SelectItem>
                    <SelectItem value="USER_CREATED_BY_ADMIN">User Created (Admin)</SelectItem>
                    <SelectItem value="USER_UPDATED_BY_ADMIN">User Updated (Admin)</SelectItem>
                    <SelectItem value="USER_DELETED_BY_ADMIN">User Deleted (Admin)</SelectItem>
                    <SelectItem value="PLAN_CREATED_BY_ADMIN">Plan Created (Admin)</SelectItem>
                    <SelectItem value="PLAN_UPDATED_BY_ADMIN">Plan Updated (Admin)</SelectItem>
                    <SelectItem value="PLAN_DELETED_BY_ADMIN">Plan Deleted (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entityType">Entity Type</Label>
                <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                  <SelectTrigger id="entityType">
                    <SelectValue placeholder="All entities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All entities</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="File">File</SelectItem>
                    <SelectItem value="Dashboard">Dashboard</SelectItem>
                    <SelectItem value="Plan">Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="limit">Logs per page</Label>
                <Select value={limit.toString()} onValueChange={(val) => setLimit(parseInt(val))}>
                  <SelectTrigger id="limit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={handleClearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Log
              </CardTitle>
              <p className="text-sm text-slate-600">
                Showing {logs.length} of {totalLogs} logs
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No logs found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                      <th className="text-left py-3 px-4 font-semibold">Entity</th>
                      <th className="text-left py-3 px-4 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="py-3 px-4 text-sm">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {log.user ? (
                            <div>
                              <p className="font-medium">{log.user.fullName || log.user.email}</p>
                              <p className="text-slate-500 text-xs">{log.user.email}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400">System</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getActionBadgeColor(log.action)}>
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {log.entity && (
                            <div>
                              <p className="font-medium">{log.entity}</p>
                              {log.entityId && (
                                <p className="text-slate-500 text-xs font-mono">#{log.entityId.slice(0, 8)}</p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {log.details || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
