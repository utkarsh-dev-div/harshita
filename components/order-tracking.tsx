"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard,
  ArrowLeft,
  Calendar,
  Phone,
  Mail
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderTrackingProps {
  order: {
    id: string
    status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
    total_amount: number
    shipping_address: string
    created_at: string
    updated_at: string
    order_items: {
      id: string
      quantity: number
      price_at_purchase: number
      product_id: string
      products: {
        id: string
        name: string
        image_urls: string[]
        swatch_color: string
      }
    }[]
  }
}

const statusConfig = {
  PENDING: {
    label: "Order Placed",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "Your order has been placed and is being processed"
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-800", 
    icon: Truck,
    description: "Your order is on its way to you"
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Your order has been delivered successfully"
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: Package,
    description: "Your order has been cancelled"
  }
}

const trackingSteps = [
  { key: "PENDING", label: "Order Placed", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle }
]

export function OrderTracking({ order }: OrderTrackingProps) {
  const currentStatus = statusConfig[order.status]
  const StatusIcon = currentStatus.icon

  const getStepIndex = (status: string) => {
    return trackingSteps.findIndex(step => step.key === status)
  }

  const currentStepIndex = getStepIndex(order.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/account">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
              <p className="text-gray-600">Order #{order.id.slice(-8).toUpperCase()}</p>
            </div>
            <Badge className={`${currentStatus.color} px-4 py-2`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {currentStatus.label}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => {
                    const StepIcon = step.icon
                    const isCompleted = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex
                    const isCancelled = order.status === "CANCELLED"

                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                            isCancelled
                              ? "border-red-300 bg-red-100 text-red-600"
                              : isCompleted
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-gray-300 bg-gray-100 text-gray-400"
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className={`font-medium ${
                            isCancelled
                              ? "text-red-600"
                              : isCompleted
                                ? "text-green-600"
                                : "text-gray-500"
                          }`}>
                            {step.label}
                          </p>
                          {isCurrent && !isCancelled && (
                            <p className="text-sm text-gray-600">{currentStatus.description}</p>
                          )}
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div className={`w-16 h-0.5 mx-4 ${
                            isCancelled
                              ? "bg-red-200"
                              : isCompleted
                                ? "bg-green-500"
                                : "bg-gray-300"
                          }`} />
                        )}
                      </motion.div>
                    )
                  })}
                </div>
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
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
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
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {order.shipping_address}
                </p>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Date</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Time</span>
                  <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span>{new Date(order.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="tel:+1234567890">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
