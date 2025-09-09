"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "")
  const [priceRange, setPriceRange] = useState<number[]>([0, 50])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data } = await supabase.from("categories").select("*")
      console.log("Fetched Categories" , data)
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  const clearFilters = () => {
    setSelectedCategory("")
    setPriceRange([0, 50])
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 50 || searchQuery

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            All <span className="text-primary">Products</span>
          </h1>
          <p className="text-lg text-muted-foreground">Discover our complete collection of premium lipsticks</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:hidden mb-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters && <Badge className="ml-2 bg-primary text-primary-foreground">Active</Badge>}
              </Button>
            </div>

            <Card className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block">Category</label>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === "" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory("")}
                      className="w-full justify-start"
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.name.toLowerCase().replace(" ", "-") ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category.name.toLowerCase().replace(" ", "-"))}
                        className="w-full justify-start"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid categoryFilter={selectedCategory} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
