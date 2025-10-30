"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function createUserProfile(userId: string, email: string, fullName: string) {
  const supabase = await getSupabaseServerClient()

  // Get the free plan
  const { data: freePlan } = await supabase.from("plans").select("id").eq("name", "Free").single()

  if (!freePlan) {
    throw new Error("Free plan not found")
  }

  // Create user profile
  const { error } = await supabase.from("users").insert({
    id: userId,
    email,
    full_name: fullName,
    plan_id: freePlan.id,
  })

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: userId,
    action: "user_signup",
    details: { email },
  })
}
