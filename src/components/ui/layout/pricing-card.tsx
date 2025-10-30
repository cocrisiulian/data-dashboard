"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
import { Check } from "lucide-react"
import { upgradePlan } from "@/lib/actions/plans"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Plan } from "@/lib/types/database"

export function PricingCard({
  plan,
  currentPlanId,
  isLoggedIn,
}: { plan: Plan; currentPlanId?: string | null; isLoggedIn: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isCurrentPlan = currentPlanId === plan.id
  const isPro = plan.name === "Pro"

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      router.push("/register")
      return
    }

    if (plan.name === "Custom") {
      alert("Please contact us for custom pricing")
      return
    }

    setLoading(true)
    try {
      await upgradePlan(plan.id)
      alert(`Successfully upgraded to ${plan.name} plan!`)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    `${plan.max_files === -1 ? "Unlimited" : plan.max_files} file${plan.max_files !== 1 ? "s" : ""}`,
    `${plan.max_charts === -1 ? "Unlimited" : plan.max_charts} chart${plan.max_charts !== 1 ? "s" : ""}`,
    `${plan.max_dashboards === -1 ? "Unlimited" : plan.max_dashboards} dashboard${plan.max_dashboards !== 1 ? "s" : ""}`,
  ]

  if (plan.name === "Pro") {
    features.push("Priority support", "Advanced analytics")
  }

  if (plan.name === "Custom") {
    features.push("Dedicated support", "Custom integrations", "SLA guarantee")
  }

  return (
    <Card className={`relative ${isPro ? "border-primary shadow-lg scale-105" : ""}`}>
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          {plan.name === "Free" && "Perfect for getting started"}
          {plan.name === "Pro" && "For growing teams"}
          {plan.name === "Custom" && "Enterprise solutions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{plan.price === 0 ? "Free" : `$${plan.price.toFixed(0)}`}</span>
            {plan.price > 0 && plan.name !== "Custom" && <span className="text-muted-foreground">/month</span>}
            {plan.name === "Custom" && <span className="text-muted-foreground">Contact us</span>}
          </div>
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isPro ? "default" : "outline"}
          onClick={handleUpgrade}
          disabled={isCurrentPlan || loading}
        >
          {isCurrentPlan ? "Current Plan" : loading ? "Processing..." : isLoggedIn ? "Upgrade" : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  )
}
