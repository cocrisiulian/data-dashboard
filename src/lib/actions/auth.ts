"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signOut() {
  try {
    const supabase = await getSupabaseServerClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
  console.error("Sign out error:", error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("*, plan:plans(*)")
      .eq("id", user.id)
      .maybeSingle()

    if (!userData && !dbError) {
  console.log("User profile not found, creating one...")

      const { data: freePlan } = await supabase.from("plans").select("id").eq("name", "Free").single()

      if (freePlan) {
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            plan_id: freePlan.id,
          })
          .select("*, plan:plans(*)")
          .single()

        if (createError) {
          console.error("Error creating user profile:", createError)
          return null
        }

        await supabase.from("usage_logs").insert({
          user_id: user.id,
          action: "user_signup",
          details: { email: user.email },
        })

        return newUser
      }
    }

    if (dbError) {
  console.error("Database error:", dbError)
      return null
    }

    return userData
  } catch (error) {
  console.error("Unexpected error in getCurrentUser:", error)
    return null
  }
}
