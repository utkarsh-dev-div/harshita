"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Search, Eye, Edit, Package, Truck, CheckCircle, X, Calendar, User, MapPin } from "lucide-react"
import Image from "next/image"

interface Order {
  id: string
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  total_amount: number
  shipping_address: string
  created_at: string
  updated_at: string
  user_id: string
  profiles: {
    name: string
  }
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

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles(name),
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
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId)

      if (error) throw error
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any, updated_at: new Date().toISOString() }
          : order
      ))
      
      setSelectedOrder(null)
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setIsUpdating(false)
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredOrders.length} orders
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders by ID, customer name, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{order.id.slice(-8).toUpperCase()}</DialogTitle>
                        </DialogHeader>
                        <OrderDetailsModal 
                          order={order} 
                          onStatusUpdate={updateOrderStatus}
                          isUpdating={isUpdating}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{order.profiles.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Items:</span>
                    <span>{order.order_items.length} products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-lg">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t">
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

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

function OrderDetailsModal({ 
  order, 
  onStatusUpdate, 
  isUpdating 
}: { 
  order: Order
  onStatusUpdate: (orderId: string, status: string) => void
  isUpdating: boolean
}) {
  const [newStatus, setNewStatus] = useState(order.status)

  const handleStatusUpdate = () => {
    onStatusUpdate(order.id, newStatus)
  }

  return (
    <div className="space-y-6">
      {/* Order Status Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Update Order Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleStatusUpdate} 
              disabled={isUpdating || newStatus === order.status}
              size="sm"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{order.profiles.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated:</span>
            <span>{new Date(order.updated_at).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {order.shipping_address}
          </p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                  <Image
                    src={item.products.image_urls[0] || "/placeholder.svg"}
                    alt={item.products.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.products.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: item.products.swatch_color }}
                    />
                    <span className="text-xs text-gray-500">Color</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">${item.price_at_purchase.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}