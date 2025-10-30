import { getPlans } from "@/lib/actions/plans"
import { getCurrentUser } from "@/lib/actions/auth"
import { PricingCard } from "@/components/ui/layout/pricing-card"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default async function PricingPage() {
  const [plans, user] = await Promise.all([getPlans(), getCurrentUser()])

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your data visualization needs. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
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
