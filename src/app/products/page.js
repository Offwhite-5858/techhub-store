"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const categories = [
  { id: "all", name: "All" },
  { id: "phones", name: "📱 Phones" },
  { id: "laptops", name: "💻 Laptops" },
  { id: "accessories", name: "🎧 Audio" },
  { id: "smart-devices", name: "⌚ Wearables" },
];

const brands = ["All", "Apple", "Samsung", "Sony", "Anker"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
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

  let filtered = products;
  if (activeCategory !== "all") filtered = filtered.filter((p) => p.category === activeCategory);
  if (activeBrand !== "All") filtered = filtered.filter((p) => (p.brand || "").toLowerCase() === activeBrand.toLowerCase());
  if (search) filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || "").toLowerCase().includes(search.toLowerCase()));
  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => (a.our_price || 0) - (b.our_price || 0));
  else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => (b.our_price || 0) - (a.our_price || 0));
  else if (sortBy === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-10">
          <p className="text-xs sm:text-sm font-semibold text-brand-600 uppercase tracking-wider mb-1 sm:mb-2">Products</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-dark-900 tracking-tight">Explore Our Collection</h1>
          <p className="text-dark-500 text-sm mt-2 max-w-xl">Premium tech curated for you. Every product backed by warranty and free shipping.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-brand-500 transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400"><X size={16} /></button>}
          </div>
          <div className="flex gap-2 sm:gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 sm:flex-none px-3 sm:px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none cursor-pointer">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="name">Name: A-Z</option>
            </select>
            <button onClick={() => setShowFilters(true)} className="sm:hidden px-3 py-3 bg-white border border-gray-200 rounded-2xl text-dark-600"><SlidersHorizontal size={18} /></button>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          <div className="hidden sm:block w-48 lg:w-56 flex-shrink-0">
            <div className="sticky top-28">
              <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Category</h3>
              <div className="space-y-1 mb-8">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-brand-50 text-brand-700" : "text-dark-600 hover:bg-gray-50"}`}>{cat.name}</button>
                ))}
              </div>
              <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Brand</h3>
              <div className="space-y-1">
                {brands.map((brand) => (
                  <button key={brand} onClick={() => setActiveBrand(brand)} className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeBrand === brand ? "bg-brand-50 text-brand-700" : "text-dark-600 hover:bg-gray-50"}`}>{brand}</button>
                ))}
              </div>
            </div>
          </div>

          {showFilters && (
            <>
              <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setShowFilters(false)} />
              <div className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white z-50 p-5 overflow-y-auto sm:hidden shadow-2xl">
                <div className="flex items-center justify-between mb-6"><h2 className="font-bold text-dark-900 text-lg">Filters</h2><button onClick={() => setShowFilters(false)} className="p-2 text-dark-600 hover:bg-gray-100 rounded-xl"><X size={20} /></button></div>
                <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Category</h3>
                <div className="space-y-1 mb-8">{categories.map((cat) => (<button key={cat.id} onClick={() => { setActiveCategory(cat.id); setShowFilters(false); }} className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${activeCategory === cat.id ? "bg-brand-50 text-brand-700" : "text-dark-600 hover:bg-gray-50"}`}>{cat.name}</button>))}</div>
                <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Brand</h3>
                <div className="space-y-1">{brands.map((brand) => (<button key={brand} onClick={() => { setActiveBrand(brand); setShowFilters(false); }} className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${activeBrand === brand ? "bg-brand-50 text-brand-700" : "text-dark-600 hover:bg-gray-50"}`}>{brand}</button>))}</div>
              </div>
            </>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner />
            ) : filtered.length > 0 ? (
              <>
                <p className="text-xs sm:text-sm text-dark-500 mb-4 sm:mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
                <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                  {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
              </>
            ) : (
              <div className="text-center py-16 sm:py-20"><span className="text-5xl sm:text-6xl block mb-4">🔍</span><h3 className="text-lg sm:text-xl font-semibold text-dark-700 mb-2">No products found</h3><p className="text-dark-500 text-sm">Try adjusting your filters</p></div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}