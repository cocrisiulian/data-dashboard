import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
  console.error("Supabase browser client: environment variables are not set")
    throw new Error("Supabase environment variables are not set.")
  }

  console.log("Creating Supabase browser client")
  client = createBrowserClient(url, anonKey)
  return client
}
