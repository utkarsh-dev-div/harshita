import { createServerClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { OrderTracking } from "@/components/order-tracking"

interface OrderPageProps {
  params: {
    orderId: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect("/auth/login")
  }

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id,
        quantity,
        price_at_purchase,
        product_id,
        products(
          id,
          name,
          image_urls,
          swatch_color
        )
      )
    `)
    .eq("id", params.orderId)
    .eq("user_id", user.id)
    .single()

  if (orderError || !order) {
    notFound()
  }

  return <OrderTracking order={order} />
}
