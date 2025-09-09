"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Matte",
    description: "Long-lasting, velvety finish",
    color: "#FF69B4",
    href: "/products?category=matte",
    gradient: "from-primary/20 to-primary/40",
  },
  {
    name: "Glossy",
    description: "High-shine, plumping formula",
    color: "#FFD700",
    href: "/products?category=glossy",
    gradient: "from-yellow-200 to-yellow-400",
  },
  {
    name: "Liquid Lipstick",
    description: "Intense pigment, all-day wear",
    color: "#DC143C",
    href: "/products?category=liquid-lipstick",
    gradient: "from-red-300 to-red-500",
  },
  {
    name: "Lip Liner",
    description: "Precise definition, waterproof",
    color: "#8B4513",
    href: "/products?category=lip-liner",
    gradient: "from-amber-200 to-amber-400",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-balance"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Find your perfect match from our curated collection of premium lipsticks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-0">
                  <div className={`h-48 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
                    {/* Decorative lipstick */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div
                          className="w-16 h-32 rounded-full shadow-2xl"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-gray-800 rounded-t-xl"></div>
                      </motion.div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors bg-transparent"
                    >
                      <Link href={category.href}>
                        Shop {category.name}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
