"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export interface Product {
  objectID: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full group">
      <div className="relative aspect-square overflow-hidden bg-secondary/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex-grow p-4">
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{product.brand}</div>
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-bold">
          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
