"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  stock_quantity: number
  categories: { name: string }
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      console.log("Fetched Products ::" , data) 
      console.log("Fetched Image ::" , data[0].image_urls[0])

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name")
      console.log("Fetched Categories" , data)

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const productData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        image_url: formData.get("image_url") as string,
        category_id: formData.get("category_id") as string,
        stock_quantity: Number.parseInt(formData.get("stock_quantity") as string),
      }

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("products").insert([productData])

        if (error) throw error
      }

      fetchProducts()
      setShowAddForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categories?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingProduct) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" defaultValue={editingProduct?.name} required />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <Select name="category_id" defaultValue={editingProduct?.category_id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      defaultValue={editingProduct?.stock_quantity}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input id="image_url" name="image_url" defaultValue={editingProduct?.image_url} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingProduct?.description} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProduct(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: any) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.image_urls[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.categories?.name}</p>
                <p className="text-lg font-bold text-pink-600 mb-2">${product.price}</p>
                <p className="text-sm text-gray-600 mb-3">Stock: {product.stock_quantity}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
