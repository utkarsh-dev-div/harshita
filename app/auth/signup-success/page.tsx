"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur text-center">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-primary" />
                </motion.div>
              </div>

              <CardTitle className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                Welcome to <span className="text-primary">Chick Pick</span>
              </CardTitle>
              <CardDescription className="text-base">
                Your account has been created successfully! You can now start shopping.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>You're all set! Your account is ready and you can start exploring our beautiful collection of lipsticks.</p>
                <p>Enjoy your shopping experience with Chick Pick!</p>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/account">
                    Go to My Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
