import { createServerClient } from "@/lib/supabase/server"
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
  console.log("Fetched Products" , product)
  if (error || !product) {
    notFound()
  }


  return <ProductDetail product={product} />
}

export async function generateStaticParams() {
  const supabase = await createServerClient()

  const { data: products } = await supabase.from("products").select("slug")
  console.log("Fetched Products" , product)
  return (
    products?.map((product) => ({
      slug: product.slug,
    })) || []
  )
}
