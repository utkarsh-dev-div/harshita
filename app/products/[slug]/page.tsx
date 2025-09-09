import { createServerClient, createStaticClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createServerClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name),
      reviews(
        id,
        rating,
        comment,
        created_at,
        profiles(name)
      )
    `)
    .eq("slug", params.slug)
    .single()

  if (error || !product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

export async function generateStaticParams() {
  const supabase = createStaticClient()

  const { data: products } = await supabase.from("products").select("slug")
  
  return (
    products?.map((product) => ({
      slug: product.slug,
    })) || []
  )
}
