"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Menu, X, Heart, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { createBrowserClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { state, toggleCart } = useCart()

  useEffect(() => {
    const supabase = createBrowserClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        checkAdminStatus(user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    const supabase = createBrowserClient()
    try {
      const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

      if (error) throw error
      setIsAdmin(data?.role === "admin")
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/chick-pick-logo.png" alt="Chick Pick" width={120} height={40} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Shop All
            </Link>
            <Link href="/products?category=matte" className="text-sm font-medium hover:text-primary transition-colors">
              Matte
            </Link>
            <Link href="/products?category=glossy" className="text-sm font-medium hover:text-primary transition-colors">
              Glossy
            </Link>
            <Link
              href="/products?category=liquid-lipstick"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Liquid
            </Link>
            <Link
              href="/products?category=lip-liner"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Liner
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search lipsticks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex hover:text-primary">
              <Heart className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                  <Link href="/account">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                    <Link href="/admin">
                      <Settings className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden md:flex hover:text-primary">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative hover:text-primary" onClick={toggleCart}>
              <ShoppingBag className="h-5 w-5" />
              {state.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs animate-pulse-glow">
                  {state.itemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search lipsticks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-0"
                />
              </div>

              {!user && (
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              <nav className="flex flex-col space-y-2">
                <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors py-2">
                  Shop All
                </Link>
                <Link
                  href="/products?category=matte"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Matte
                </Link>
                <Link
                  href="/products?category=glossy"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Glossy
                </Link>
                <Link
                  href="/products?category=liquid-lipstick"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Liquid
                </Link>
                <Link
                  href="/products?category=lip-liner"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Liner
                </Link>

                {user && (
                  <>
                    <Link href="/account" className="text-sm font-medium hover:text-primary transition-colors py-2">
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors py-2">
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
