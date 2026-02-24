"use client";

import { useState, useEffect } from "react";
import { Searchbar } from "@/components/Searchbar";
import { ProductCard, type Product } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      console.log('BROWSER LOG: Starting fetch for target', query);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        console.log('BROWSER LOG: Fetch success array length:', data.results?.length);
        if (data.results) {
          setProducts(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        console.log('BROWSER LOG: Fetch finally executed');
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Discover Components</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-lg">
          Explore our collection of premium electronics, from high-performance laptops to immersive audio gear.
        </p>
        <Searchbar value={query} onSearch={setQuery} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AnimatePresence>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product.objectID}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/product/${product.objectID}`}>
                    <ProductCard product={product} />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms.</p>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
