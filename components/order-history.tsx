"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Package, Truck, CheckCircle, X, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Order {
  id: string
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  total_amount: number
  created_at: string
  updated_at: string
  order_items: {
    id: string
    quantity: number
    price_at_purchase: number
    products: {
      id: string
      name: string
      image_urls: string[]
      swatch_color: string
    }
  }[]
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) return

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(
            id,
            quantity,
            price_at_purchase,
            products(
              id,
              name,
              image_urls,
              swatch_color
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "SHIPPED": return "bg-blue-100 text-blue-800"
      case "DELIVERED": return "bg-green-100 text-green-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return Package
      case "SHIPPED": return Truck
      case "DELIVERED": return CheckCircle
      case "CANCELLED": return X
      default: return Package
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading your orders...</div>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order History</h2>
        <Badge variant="outline">{orders.length} orders</Badge>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = getStatusIcon(order.status)
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Track Order
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Order Date:</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Items:</span>
                    <span>{order.order_items.length} products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-lg">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="pt-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {order.order_items.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.products.image_urls[0] || "/placeholder.svg"}
                          alt={item.products.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.order_items.length > 5 && (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium">+{order.order_items.length - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}