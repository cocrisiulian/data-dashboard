"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
import { Check } from "lucide-react"
import { upgradePlan } from "@/lib/actions/plans"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Plan } from "@/lib/types/database"
import { toast } from "@/hooks/use-toast"

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
      toast({
        title: "Custom plan",
        description: "Please contact us to tailor a plan to your needs.",
      })
      return
    }

    setLoading(true)
    try {
      await upgradePlan(plan.id)
      toast({
        title: "Plan updated",
        description: `Successfully upgraded to ${plan.name} plan.`,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Upgrade failed",
        description: error?.message ?? "Something went wrong while upgrading.",
        variant: "destructive",
      })
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
    <Card
      className={`relative group flex h-full flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isPro ? "border-primary ring-1 ring-primary/40 shadow-lg bg-gradient-to-b from-primary/5 to-transparent" : "hover:border-foreground/20"
      }`}
    >
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">{plan.name}</CardTitle>
        <CardDescription className="text-sm">
          {plan.name === "Free" && "Perfect for getting started"}
          {plan.name === "Pro" && "For growing teams"}
          {plan.name === "Custom" && "Enterprise solutions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline gap-1">
            <span className={`font-bold ${isPro ? "text-5xl" : "text-4xl"}`}>
              {plan.price === 0 ? "Free" : `$${plan.price.toFixed(0)}`}
            </span>
            {plan.price > 0 && plan.name !== "Custom" && <span className="text-muted-foreground">/month</span>}
            {plan.name === "Custom" && <span className="text-muted-foreground">Contact us</span>}
          </div>
        </div>
        <div className="h-px bg-border/70" />
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
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
