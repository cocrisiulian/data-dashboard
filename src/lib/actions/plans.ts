"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getPlans() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("plans").select("*").order("price", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch plans: ${error.message}`)
  }

  return data
}

export async function upgradePlan(planId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("users").update({ plan_id: planId }).eq("id", user.id)

  if (error) {
    throw new Error(`Failed to upgrade plan: ${error.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "plan_upgrade",
    details: { plan_id: planId },
  })

  revalidatePath("/", "layout")
}
