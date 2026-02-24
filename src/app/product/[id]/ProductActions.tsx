"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/components/ProductCard";

export function ProductActions({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <Button size="lg" className="flex-grow h-14 text-lg">
        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
      </Button>
      <Button size="lg" variant="outline" className="h-14 text-lg px-12">
        Wishlist
      </Button>
    </motion.div>
  );
}
