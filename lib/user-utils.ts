import { createClient } from "@/lib/supabase/client"

export async function ensureUserProfile(userId: string, userEmail?: string, userName?: string) {
  const supabase = createClient()
  
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single()

  if (!existingProfile) {
    // Create profile if it doesn't exist
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        name: userName || userEmail?.split('@')[0] || 'User',
        email: userEmail,
        role: 'USER'
      })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      throw new Error("Failed to create user profile")
    }
  }
}
