import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { type Product } from "@/components/ProductCard";
import { ProductActions } from "./ProductActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product> {
  // In Next.js Server Components, we have to use absolute URLs for fetch.
  // During local dev/testing it might be 3000 or 3001. We use an env var or a smart fallback.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.PLAYWRIGHT_TEST_URL || 'http://localhost:3001';
  const res = await fetch(`${baseUrl}/api/product/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/shop">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/20 p-8">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="text-sm font-medium text-primary uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-4xl font-bold mt-1 tracking-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(120+ reviews)</span>
          </div>

          <p className="text-3xl font-bold mb-8">${product.price.toLocaleString()}</p>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Complimentary shipping on orders over $500</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>2-year manufacturer warranty included</span>
            </div>
          </div>

          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}
