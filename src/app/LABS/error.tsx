'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, BookOpen, Home } from 'lucide-react';
import Link from 'next/link';

export default function LabsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Labs error:', error);
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
            Eroare la încărcarea laboratorului
          </CardTitle>
          <CardDescription className="text-base">
            Nu am putut încărca conținutul acestui laborator
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm font-semibold mb-3">Posibile cauze:</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Laboratorul nu a fost implementat încă</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Link-ul către laborator este incorect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Lipsesc componente necesare pentru acest laborator</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Datele pentru acest laborator nu au fost încărcate</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
              💡 Sugestie
            </p>
            <p className="text-sm text-muted-foreground">
              Navighează înapoi la lista de laboratoare și încearcă un alt laborator. 
              Dacă problema persistă pentru un anumit laborator, acesta ar putea fi în curs de implementare.
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
              <Link href="/LABS">
                <BookOpen className="h-4 w-4 mr-2" />
                Lista Laboratoare
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary" className="flex-1">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
