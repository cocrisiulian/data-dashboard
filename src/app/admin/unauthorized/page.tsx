/**
 * Admin Unauthorized Page
 * Route: /admin/unauthorized
 * 
 * Afișat când:
 * - User nu este autentificat
 * - User este autentificat dar nu este admin (is_admin = false)
 * 
 * Acțiuni:
 * - Button "Go to Home" → redirect la /
 * - Button "Login" → redirect la /login
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/controls/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          
          <CardTitle className="text-3xl font-bold">
            Access Denied
          </CardTitle>
          
          <CardDescription className="text-lg">
            You don&apos;t have permission to access this page. This area is restricted to administrators only.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Note:</strong> If you believe you should have access to this area, please contact your system administrator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              asChild 
              className="flex-1"
              variant="outline"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>

            <Button 
              asChild 
              className="flex-1"
            >
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
