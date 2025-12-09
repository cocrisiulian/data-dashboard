'use client';

import { useEffect } from "react";
import { Button } from '@/components/ui/controls/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { AlertCircle, RefreshCw, Home, LayoutDashboard } from "lucide-react";
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-destructive/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Eroare la încărcarea Dashboard-ului
          </CardTitle>
          <CardDescription className="text-base">
            Nu am putut încărca dashboard-ul tău
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm font-semibold mb-3">Posibile cauze:</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Dashboard-ul nu există sau a fost șters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Nu ai permisiuni pentru a accesa acest dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Conexiunea la server a fost întreruptă</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Dashboard-ul conține date invalide</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
              💡 Sugestie
            </p>
            <p className="text-sm text-muted-foreground">
              Încearcă să navighezi la lista de dashboard-uri și verifică dacă dashboard-ul există. 
              Poți crea un dashboard nou dacă acesta a fost șters.
            </p>
          </div>

          <details className="p-4 bg-muted/30 rounded-lg border">
            <summary className="text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground">
              Detalii tehnice
            </summary>
            <div className="mt-3 p-3 bg-muted rounded text-xs font-mono text-destructive overflow-x-auto">
              <p>{error.message}</p>
              {error.digest && <p className="mt-1 text-muted-foreground">Digest: {error.digest}</p>}
            </div>
          </details>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} size="lg" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reîncearcă
            </Button>

            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Lista Dashboard-uri
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
