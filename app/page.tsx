import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoryShowcase } from "@/components/category-showcase"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Instagram, Twitter, Facebook } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <HeroSection />

        <CategoryShowcase />

        {/* Best Sellers Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 text-balance"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                <span className="text-secondary">Best</span> Sellers
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Discover what everyone's talking about - our most loved lipsticks
              </p>
            </div>

            <ProductGrid featured={true} limit={8} />

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 text-balance"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Stay in the <span className="text-primary">Loop</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-balance">
                Be the first to know about new launches, exclusive offers, and beauty tips
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background border-0 shadow-lg"
                />
                <Button className="animate-pulse-glow">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Chick Pick
              </h3>
              <p className="text-sm text-background/80 mb-4">
                Bold lipsticks for bold you. Express yourself with our vibrant collection.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products" className="text-background/80 hover:text-primary transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=matte"
                    className="text-background/80 hover:text-primary transition-colors"
                  >
                    Matte
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=glossy"
                    className="text-background/80 hover:text-primary transition-colors"
                  >
                    Glossy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?featured=true"
                    className="text-background/80 hover:text-primary transition-colors"
                  >
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-background/80 hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-background/80 hover:text-primary transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-background/80 hover:text-primary transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-background/80 hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-background/80 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-background/80 hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-background/80 hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-background/80 hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 text-center">
            <p className="text-sm text-background/60">© 2025 Chick Pick. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
