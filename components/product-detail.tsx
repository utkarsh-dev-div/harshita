"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { ReviewSection } from "@/components/review-section"
import { Star, Heart, ShoppingBag, Minus, Plus } from "lucide-react"
import Image from "next/image"

interface ProductDetailProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    image_urls: string[]
    swatch_color: string
    stock_quantity: number
    category: { name: string }
    reviews: {
      id: string
      rating: number
      comment: string
      created_at: string
      profiles: { name: string }
    }[]
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

  const handleAddToCart = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <Image
                src={product.image_urls[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {product.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-pink-500 shadow-lg" : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <Badge className="mb-2 bg-gradient-to-r from-pink-500 to-orange-500">{product.category.name}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>

              <p className="text-3xl font-bold text-pink-600 mb-4">${product.price}</p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Color Swatch */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Color:</span>
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: product.swatch_color }}
                />
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Stock:</span>
                <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of stock"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="p-3 bg-transparent">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <ReviewSection productId={product.id} reviews={product.reviews} />
        </motion.div>
      </div>
    </div>
  )
}
