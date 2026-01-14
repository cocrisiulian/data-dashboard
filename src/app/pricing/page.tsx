"use client"

import { PricingCard } from "@/components/ui/layout/pricing-card"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { api } from "@/lib/api/client"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"

export default function PricingPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.plans.getAll()
      // Filter out Admin plan - only for internal use
      const publicPlans = data.filter((plan: any) => plan.name !== 'Admin')
      setPlans(publicPlans)
    } catch (error) {
      console.error("Failed to load plans:", error)
      setError(error instanceof Error ? error.message : "Failed to load plans")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading plans...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold tracking-tight">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select the perfect plan for your data visualization needs. Upgrade or downgrade at any time.
            </p>
            {user?.isAdmin && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Admin Account:</strong> You have unlimited access to all features. Plan selection is disabled for admin accounts.
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                currentPlanId={user?.plan?.id}
                isLoggedIn={!!user}
                isAdminUser={user?.isAdmin || false}
              />
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>All plans include secure data storage and basic analytics.</p>
            <p className="mt-2">Need help choosing? Contact our support team.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
