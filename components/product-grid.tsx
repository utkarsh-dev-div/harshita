"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Star, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/contexts/cart-context"

interface Product {
  id: string
  name: string
  description: string
  price: number
  slug: string
  image_urls: string[]
  swatch_color: string
  stock_quantity: number
  is_featured: boolean
  category: {
    name: string
  }
}

interface ProductGridProps {
  featured?: boolean
  categoryFilter?: string
  limit?: number
}

export function ProductGrid({ featured = false, categoryFilter, limit }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("[v0] Fetching products with Supabase client...")
        const supabase = createClient()

        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        let query = supabase
          .from("products")
          .select(`
            *,
            category:categories(name)
          `)
          .gt("stock_quantity", 0)

        if (featured) {
          query = query.eq("is_featured", true)
        }

        if (categoryFilter) {
          query = query.eq("categories.name", categoryFilter)
        }

        if (limit) {
          query = query.limit(limit)
        }

        console.log("[v0] Executing Supabase query...")
        const { data, error: fetchError } = await query
        console.log("Fetched data ::" , data)
        if (fetchError) {
          console.error("[v0] Supabase query error:", fetchError)
          throw fetchError
        }

        console.log("[v0] Successfully fetched products:", data?.length || 0)
        setProducts(data || [])
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [featured, categoryFilter, limit])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_urls[0] || "",
      swatch_color: product.swatch_color,
      stock_quantity: product.stock_quantity,
    })
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to load products</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-2xl h-80"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center relative">
                  {/* Product Image */}
                  <Image
                    src={product.image_urls[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={256}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="rounded-full" onClick={() => handleAddToCart(product)}>
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_featured && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Best Seller
                      </Badge>
                    )}
                    {product.stock_quantity < 20 && <Badge variant="destructive">Low Stock</Badge>}
                  </div>

                  {/* Color Swatch */}
                  <div className="absolute top-3 right-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: product.swatch_color }}
                    ></div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
   

                  <p className="text-sm font-bold text-muted-foreground mb-3 line-clamp-2">{product.name}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">${product.price}</span>
                    <Button
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
