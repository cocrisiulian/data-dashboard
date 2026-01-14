'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, RefreshCw, AlertTriangle, Clock, File, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/controls/button';
import { Card } from '@/components/ui/layout/card';
import { Badge } from '@/components/ui/text/badge';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

interface TrashFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
  deleted_at: string;
  days_remaining: number;
  can_restore: boolean;
}

interface TrashDashboard {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  deleted_at: string;
  charts_count: number;
  days_remaining: number;
  can_restore: boolean;
}

export default function TrashPage() {
  const router = useRouter();
  const [files, setFiles] = useState<TrashFile[]>([]);
  const [dashboards, setDashboards] = useState<TrashDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'dashboards'>('files');
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTrash();
  }, [router]);

  const fetchTrash = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Fetch deleted files
      const filesRes = await fetch('http://localhost:4000/api/files/trash', { headers });
      if (!filesRes.ok) throw new Error('Failed to fetch deleted files');
      const filesData = await filesRes.json();

      // Fetch deleted dashboards
      const dashboardsRes = await fetch('http://localhost:4000/api/dashboards/trash', { headers });
      if (!dashboardsRes.ok) throw new Error('Failed to fetch deleted dashboards');
      const dashboardsData = await dashboardsRes.json();

      setFiles(filesData);
      setDashboards(dashboardsData);
    } catch (err) {
      console.error('Error fetching trash:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trash');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to restore this file?')) return;

    setRestoring(fileId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/files/${fileId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to restore file');
      }

      // Refresh trash
      await fetchTrash();
      alert('File restored successfully!');
    } catch (err) {
      console.error('Error restoring file:', err);
      alert(err instanceof Error ? err.message : 'Failed to restore file');
    } finally {
      setRestoring(null);
    }
  };

  const handlePermanentDeleteFile = async (fileId: string) => {
    if (!confirm('⚠️ WARNING: This will permanently delete the file. This action cannot be undone!\n\nAre you absolutely sure?')) return;

    setDeleting(fileId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/files/${fileId}/permanent`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete file');
      }

      // Refresh trash
      await fetchTrash();
      alert('File permanently deleted');
    } catch (err) {
      console.error('Error deleting file:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const handleRestoreDashboard = async (dashboardId: string) => {
    if (!confirm('Are you sure you want to restore this dashboard?')) return;

    setRestoring(dashboardId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/dashboards/${dashboardId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to restore dashboard');
      }

      // Refresh trash
      await fetchTrash();
      alert('Dashboard restored successfully!');
    } catch (err) {
      console.error('Error restoring dashboard:', err);
      alert(err instanceof Error ? err.message : 'Failed to restore dashboard');
    } finally {
      setRestoring(null);
    }
  };

  const handlePermanentDeleteDashboard = async (dashboardId: string) => {
    if (!confirm('⚠️ WARNING: This will permanently delete the dashboard and all its charts. This action cannot be undone!\n\nAre you absolutely sure?')) return;

    setDeleting(dashboardId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/dashboards/${dashboardId}/permanent`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete dashboard');
      }

      // Refresh trash
      await fetchTrash();
      alert('Dashboard permanently deleted');
    } catch (err) {
      console.error('Error deleting dashboard:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete dashboard');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <DashboardNav />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading trash...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardNav />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900">Trash</h1>
          </div>
          <p className="text-gray-600">
            Items in trash will be automatically deleted after 30 days
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'files'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              Files ({files.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dashboards')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'dashboards'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboards ({dashboards.length})
            </div>
          </button>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div>
            {files.length === 0 ? (
              <Card className="p-12 text-center">
                <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No deleted files</p>
                <p className="text-gray-500 text-sm mt-2">
                  Files you delete will appear here for 30 days
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {files.map((file) => (
                  <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <File className="h-5 w-5 text-gray-600" />
                          <h3 className="font-semibold text-gray-900">{file.file_name}</h3>
                          <Badge variant={file.can_restore ? 'default' : 'destructive'}>
                            {file.file_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatFileSize(file.file_size)}</span>
                          <span>•</span>
                          <span>Deleted {formatDate(file.deleted_at)}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className={file.can_restore ? 'text-orange-600' : 'text-red-600'}>
                              {file.days_remaining} days remaining
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreFile(file.id)}
                          disabled={!file.can_restore || restoring === file.id}
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 ${restoring === file.id ? 'animate-spin' : ''}`} />
                          Restore
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handlePermanentDeleteFile(file.id)}
                          disabled={deleting === file.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete Forever
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dashboards Tab */}
        {activeTab === 'dashboards' && (
          <div>
            {dashboards.length === 0 ? (
              <Card className="p-12 text-center">
                <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No deleted dashboards</p>
                <p className="text-gray-500 text-sm mt-2">
                  Dashboards you delete will appear here for 30 days
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {dashboards.map((dashboard) => (
                  <Card key={dashboard.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <LayoutDashboard className="h-5 w-5 text-gray-600" />
                          <h3 className="font-semibold text-gray-900">{dashboard.name}</h3>
                          {dashboard.charts_count > 0 && (
                            <Badge variant="secondary">
                              {dashboard.charts_count} chart{dashboard.charts_count !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        {dashboard.description && (
                          <p className="text-gray-600 text-sm mb-2">{dashboard.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Created {formatDate(dashboard.created_at)}</span>
                          <span>•</span>
                          <span>Deleted {formatDate(dashboard.deleted_at)}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className={dashboard.can_restore ? 'text-orange-600' : 'text-red-600'}>
                              {dashboard.days_remaining} days remaining
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreDashboard(dashboard.id)}
                          disabled={!dashboard.can_restore || restoring === dashboard.id}
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 ${restoring === dashboard.id ? 'animate-spin' : ''}`} />
                          Restore
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handlePermanentDeleteDashboard(dashboard.id)}
                          disabled={deleting === dashboard.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete Forever
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
