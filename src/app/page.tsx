"use client"

import { Button } from "@/components/ui/controls/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { BarChart3, FileText, LayoutDashboard, BookOpen } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DataInsight Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/files">My Files</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Transform Your Data Into Beautiful Visualizations
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Upload CSV files, create interactive charts, and build stunning dashboards in minutes. No coding required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={user ? "/dashboard" : "/register"}>{user ? "Go to Dashboard" : "Start Free Trial"}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-semibold">DataInsight Dashboard</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/LABS" className="hover:text-foreground transition-colors flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Labs
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
          
          {/* Labs CTA Section */}
          <div className="mt-8 pt-8 border-t">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <BookOpen className="h-4 w-4" />
                Academic Project
              </div>
              <h3 className="text-2xl font-bold">PPAW Laboratory Work</h3>
              <p className="text-muted-foreground">
                Explore 7 interactive laboratories demonstrating web application architecture concepts
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/LABS" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  View All Labs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
