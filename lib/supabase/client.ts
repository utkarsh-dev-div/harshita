import { createBrowserClient as supabaseCreateBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
    })
    throw new Error("Supabase configuration missing")
  }

  console.log("[v0] Creating Supabase client with URL:", supabaseUrl)
  return supabaseCreateBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createBrowserClient() {
  return createClient()
}
