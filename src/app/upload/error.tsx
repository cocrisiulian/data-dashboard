'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Upload, FileText } from 'lucide-react';
import Link from 'next/link';

export default function UploadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Upload error:', error);
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
            Eroare la încărcarea fișierului
          </CardTitle>
          <CardDescription className="text-base">
            Nu am putut procesa fișierul pentru încărcare
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm font-semibold mb-3">Verifică următoarele:</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Fișierul este în format CSV valid</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Dimensiunea fișierului nu depășește 10MB</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Ai suficient spațiu de stocare disponibil</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Fișierul CSV are header-uri (prima linie cu numele coloanelor)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Datele sunt separate corect (virgulă, punct și virgulă, etc.)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
              ⚠️ Cerințe format CSV
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Prima linie trebuie să conțină header-uri (nume coloane)</p>
              <p>• Valorile trebuie separate prin virgulă sau punct și virgulă</p>
              <p>• Encoding: UTF-8 (pentru caractere speciale)</p>
              <p>• Format date acceptat: YYYY-MM-DD sau DD/MM/YYYY</p>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
              💡 Exemplu CSV valid
            </p>
            <div className="mt-2 p-3 bg-muted rounded text-xs font-mono overflow-x-auto">
              <code className="text-foreground">
                nume,valoare,data<br />
                Produs A,100,2024-01-01<br />
                Produs B,200,2024-01-02<br />
                Produs C,150,2024-01-03
              </code>
            </div>
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
              Încearcă din nou
            </Button>

            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href="/files">
                <FileText className="h-4 w-4 mr-2" />
                Vezi fișierele mele
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
