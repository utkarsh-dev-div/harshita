"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Star } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"

export default function CheckoutSuccessPage() {
  const [orderNumber] = useState(() => "CP" + Math.random().toString(36).substr(2, 9).toUpperCase())

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000
    const end = Date.now() + duration

    const colors = ["#FF69B4", "#FF9933", "#00FFFF"]
    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <h1
              className="text-3xl md:text-4xl font-bold mb-4 text-balance"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Order <span className="text-primary">Confirmed!</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for your purchase! Your order has been successfully placed.
            </p>

            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Order Number:</span>
                  <span className="font-mono text-primary">{orderNumber}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your email address with order details and tracking information.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Status Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-sm text-muted-foreground">
                        Your order has been received and is being processed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Preparing for Shipment</p>
                      <p className="text-sm text-muted-foreground">We're carefully packing your lipsticks</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Shipped</p>
                      <p className="text-sm text-muted-foreground">Your order is on its way to you</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="animate-pulse-glow">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/account/orders">Track Your Order</Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Love your new lipsticks? Share your look with us!</p>
              <Button variant="ghost" size="sm" className="text-primary">
                <Star className="w-4 h-4 mr-2" />
                Leave a Review
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
