'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/controls/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for developers
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-red-900/50 bg-slate-900/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Oops! Ceva nu a mers bine
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            A apărut o eroare neașteptată în aplicație
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Helpful Information */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm font-semibold text-slate-300 mb-3">
              Ce poți face:
            </p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">1.</span>
                <span>Încearcă să reîncarci pagina folosind butonul de mai jos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">2.</span>
                <span>Verifică conexiunea la internet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">3.</span>
                <span>Încearcă să te deloghezi și să te autentifici din nou</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">4.</span>
                <span>Dacă problema persistă, contactează suportul tehnic</span>
              </li>
            </ul>
          </div>

          {/* Technical Details (collapsed by default) */}
          <details className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <summary className="text-sm font-semibold text-slate-400 cursor-pointer hover:text-slate-300">
              Detalii tehnice (pentru dezvoltatori)
            </summary>
            <div className="mt-3 p-3 bg-slate-900/50 rounded text-xs font-mono text-red-400 overflow-x-auto">
              <p className="mb-1">
                <span className="text-slate-500">Error:</span> {error.message}
              </p>
              {error.digest && (
                <p>
                  <span className="text-slate-500">Digest:</span> {error.digest}
                </p>
              )}
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Încearcă din nou
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Înapoi la Home
              </Link>
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-slate-500">
            Eroarea a fost înregistrată automat pentru investigare
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
