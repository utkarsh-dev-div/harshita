import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Chick Pick - Bold Lipsticks for Bold You",
  description:
    "Discover vibrant, long-lasting lipsticks that make a statement. Shop Chick Pick's collection of matte, glossy, and liquid lipsticks.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${playfair.variable} ${sourceSans.variable}`}>
        <CartProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
