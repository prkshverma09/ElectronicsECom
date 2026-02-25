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
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      setLoading(true);
      setPage(0);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, page: 0 }),
        });
        const data = await response.json();
        if (data.results) {
          setProducts(data.results);
          setHasMore(data.page < data.nbPages - 1);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchInitialProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, page: nextPage }),
      });
      const data = await response.json();
      if (data.results) {
        setProducts((prev) => [...prev, ...data.results]);
        setPage(data.page);
        setHasMore(data.page < data.nbPages - 1);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
        <>
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

          {hasMore && products.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {loadingMore ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  "Load More Products"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
