import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log("Current user:" , user)
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  //const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()



  return <AdminDashboard />
}
