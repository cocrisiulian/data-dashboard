import { getPlans } from "@/lib/actions/plans"
import { getCurrentUser } from "@/lib/actions/auth"
import { PricingCard } from "@/components/ui/layout/pricing-card"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default async function PricingPage() {
  const [plans, user] = await Promise.all([getPlans(), getCurrentUser()])

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
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} currentPlanId={user?.plan_id} isLoggedIn={!!user} />
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
