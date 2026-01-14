/**
 * Recent Users Table Component
 * Displays the most recently registered users
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/text/badge';
import { formatDistanceToNow } from 'date-fns';

interface RecentUser {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  plan: {
    name: string;
  };
  _count: {
    dashboards: number;
    files: number;
  };
}

export function RecentUsersTable() {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/analytics/recent-users?limit=10');
      const { data } = await response.json();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch recent users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Expose refresh to parent
  useEffect(() => {
    (window as any).__recentUsersRefresh = fetchUsers;
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Last 10 registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>Last 10 registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-center">Dashboards</TableHead>
              <TableHead className="text-center">Files</TableHead>
              <TableHead>Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.fullName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.plan.name}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user._count.dashboards}
                  </TableCell>
                  <TableCell className="text-center">
                    {user._count.files}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
