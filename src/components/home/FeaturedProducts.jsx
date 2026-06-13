"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">Featured Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 tracking-tight">Best Sellers</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 text-dark-600 font-medium hover:text-brand-600 transition-colors group">
            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-dark-400">No featured products yet.</div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link href="/products" className="inline-flex items-center gap-2 text-brand-600 font-medium group">
            View All Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}