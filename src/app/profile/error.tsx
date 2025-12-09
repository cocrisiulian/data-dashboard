"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
import { AlertCircle, Home, RefreshCw, User } from "lucide-react"
import Link from "next/link"

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Profile error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Eroare la Încărcarea Profilului
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            A apărut o problemă la încărcarea informațiilor profilului tău
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Helpful Information */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm font-semibold text-slate-300 mb-3">
              Posibile cauze:
            </p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Sesiunea ta a expirat - încearcă să te autentifici din nou</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Probleme temporare de conexiune cu serverul</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Contul tău are nevoie de actualizare</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Cache-ul browserului poate cauza probleme</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset} 
              size="lg" 
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reîncearcă
            </Button>

            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary" className="flex-1">
              <Link href="/login">
                <User className="h-4 w-4 mr-2" />
                Autentificare
              </Link>
            </Button>
          </div>

          {/* Technical Details (Collapsible) */}
          <details className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <summary className="text-sm font-medium text-slate-300 cursor-pointer">
              Detalii Tehnice (pentru dezvoltatori)
            </summary>
            <div className="mt-3 text-xs text-slate-400 font-mono break-all">
              <p><strong>Mesaj:</strong> {error.message}</p>
              {error.digest && <p className="mt-1"><strong>Digest:</strong> {error.digest}</p>}
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
