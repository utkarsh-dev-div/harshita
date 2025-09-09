import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { UserProfile } from "@/components/user-profile"
import { OrderHistory } from "@/components/order-history"

export default async function AccountPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            My <span className="text-primary">Account</span>
          </h1>
          <p className="text-lg text-muted-foreground">Manage your profile and view your order history</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UserProfile user={data.user} />
          </div>

          <div className="lg:col-span-2">
            <OrderHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
