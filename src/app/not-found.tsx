import Link from "next/link";
import { Button } from "@/components/ui/controls/button";
import { Card, CardContent } from "@/components/ui/layout/card";
import { Home, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-slate-700 bg-slate-900/50 backdrop-blur">
        <CardContent className="pt-12 pb-8 px-8 text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-3">
              Pagina nu a fost găsită
            </h2>
            <p className="text-slate-300 text-lg">
              Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.
            </p>
          </div>

          {/* Helpful Information */}
          <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Sugestii:</span>
            </p>
            <ul className="text-sm text-slate-400 text-left space-y-1">
              <li>• Verifică dacă URL-ul este scris corect</li>
              <li>• Încearcă să navighezi din meniul principal</li>
              <li>• Link-ul ar putea fi expirat sau incorect</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Înapoi la Home
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Link href="/LABS" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Vezi Laboratoare
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => window.history.back()}
            >
              <span className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </span>
            </Button>
          </div>

          {/* Footer Note */}
          <p className="mt-8 text-xs text-slate-500">
            Dacă problema persistă, contactează administratorul.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
