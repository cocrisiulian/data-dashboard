/**
 * Top Active Users Table Component
 * Displays users ranked by activity score (dashboards * 3 + charts * 2 + files * 1)
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/text/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface TopUser {
  id: string;
  email: string;
  fullName: string | null;
  _count: {
    dashboards: number;
    files: number;
  };
  activityScore: number;
}

export function TopUsersTable() {
  const [users, setUsers] = useState<TopUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/analytics/top-users?limit=10');
      const { data } = await response.json();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch top users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Expose refresh to parent
  useEffect(() => {
    (window as any).__topUsersRefresh = fetchUsers;
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">{index + 1}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Active Users</CardTitle>
          <CardDescription>Users ranked by activity score</CardDescription>
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
        <CardTitle>Top Active Users</CardTitle>
        <CardDescription>
          Users ranked by activity score (Dashboards × 3 + Files × 1)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Dashboards</TableHead>
              <TableHead className="text-center">Files</TableHead>
              <TableHead className="text-right">Score</TableHead>
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
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.fullName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{user._count.dashboards}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{user._count.files}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {user.activityScore}
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
