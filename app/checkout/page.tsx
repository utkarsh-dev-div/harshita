"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { createClient } from "@/lib/supabase/client"
import { ensureUserProfile } from "@/lib/user-utils"
import { ArrowLeft, ArrowRight, CreditCard, Truck, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type CheckoutStep = "shipping" | "payment" | "review"

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const subtotal = state.total
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax - discount

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(subtotal * 0.1)
    } else if (promoCode.toLowerCase() === "save5") {
      setDiscount(5)
    }
  }

  const handleNextStep = () => {
    if (currentStep === "shipping") {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCurrentStep("review")
    }
  }

  const handlePreviousStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping")
    } else if (currentStep === "review") {
      setCurrentStep("payment")
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      // Ensure user profile exists
      await ensureUserProfile(
        user.id, 
        user.email, 
        user.user_metadata?.name
      )

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "PENDING",
          total_amount: total,
          shipping_address: `${shippingInfo.firstName} ${shippingInfo.lastName}\n${shippingInfo.address}\n${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}\n${shippingInfo.country}`,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart and redirect to order tracking
      clearCart()
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to proceed with checkout</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { key: "shipping", label: "Shipping", icon: Truck },
              { key: "payment", label: "Payment", icon: CreditCard },
              { key: "review", label: "Review", icon: CheckCircle },
            ].map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.key
              const isCompleted =
                ["shipping", "payment"].indexOf(currentStep) > ["shipping", "payment"].indexOf(step.key)

              return (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground bg-background text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < 2 && <div className={`w-16 h-0.5 mx-4 ${isCompleted ? "bg-primary" : "bg-muted"}`} />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === "shipping" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        value={paymentInfo.nameOnCard}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === "review" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                        <br />
                        {shippingInfo.address}
                        <br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Payment Method</h4>
                      <p className="text-sm text-muted-foreground">**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === "shipping"}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === "review" ? (
                <Button onClick={handlePlaceOrder} disabled={isProcessing} className="animate-pulse-glow">
                  {isProcessing ? "Processing..." : "Place Order"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${item.swatch_color}40, ${item.swatch_color}60)`,
                        }}
                      >
                        <div className="w-4 h-8 rounded-full" style={{ backgroundColor: item.swatch_color }}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Promo Code */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <Badge className="bg-green-100 text-green-800">Promo applied: -${discount.toFixed(2)}</Badge>
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
