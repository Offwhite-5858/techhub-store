"use client";

import { ShoppingCart, Zap, Star, Check } from "lucide-react";
import { useState } from "react";
import { formatPrice, orderProduct } from "@/lib/whatsapp";
import Link from "next/link";

function TruckIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  const ourPrice = product.our_price || product.ourPrice || 0;
  const marketPrice = product.market_price || product.marketPrice || 0;
  const savings = marketPrice - ourPrice;
  const savingsPercent = marketPrice > 0 ? Math.round((savings / marketPrice) * 100) : 0;
  const imageUrl = product.image_url || product.imageUrl || "";
  const badge = product.badge || "";
  const category = product.category || "";
  const brand = product.brand || "";

  const addToCart = (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    if (existing) { existing.quantity += 1; } else { cart.push({ id: product.id, name: product.name, price: ourPrice, quantity: 1, imageUrl }); }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl sm:hover:shadow-2xl hover:border-transparent transition-all duration-300 flex flex-col hover:-translate-y-0.5 sm:hover:-translate-y-1">
      <div className="relative h-44 sm:h-52 md:h-60 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-accent-500/0 group-hover:from-brand-500/5 group-hover:to-accent-500/5 transition-all duration-500" />
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="w-full h-full object-contain relative z-10 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <span className="text-5xl sm:text-6xl md:text-7xl relative z-10 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500">
            {category === "phones" ? "📱" : category === "laptops" ? "💻" : category === "accessories" ? "🎧" : "⌚"}
          </span>
        )}
        <div className="absolute top-3 left-3 flex flex-col sm:flex-row gap-1 sm:gap-2 z-20">
          {badge && <span className="bg-dark-900 text-white text-[10px] sm:text-[11px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">{badge}</span>}
          {savings > 0 && <span className="bg-green-500 text-white text-[10px] sm:text-[11px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">-{savingsPercent}%</span>}
        </div>
        <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" />
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1 relative z-20">
        <p className="text-[10px] sm:text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-0.5 sm:mb-1">{brand}</p>
        <Link href={`/products/${product.id}`} className="font-semibold text-dark-900 mb-0.5 sm:mb-1 leading-snug hover:text-brand-600 transition-colors line-clamp-2 text-sm sm:text-base">{product.name}</Link>
        <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-accent-400 fill-accent-400" />)}
          <span className="text-[10px] sm:text-[11px] text-dark-400 ml-0.5 sm:ml-1">(24)</span>
        </div>
        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <span className="text-lg sm:text-xl font-bold text-dark-900">{formatPrice(ourPrice)}</span>
          {marketPrice > ourPrice && <span className="text-xs sm:text-sm text-dark-400 line-through">{formatPrice(marketPrice)}</span>}
        </div>
        <div className="flex gap-1.5 sm:gap-2 mt-auto">
          <button onClick={addToCart} className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${added ? "bg-green-500 text-white" : "bg-dark-900 text-white hover:bg-dark-800"}`}>
            {added ? <Check size={14} /> : <ShoppingCart size={14} />} {added ? "Added!" : "Cart"}
          </button>
          <button onClick={(e) => { e.preventDefault(); orderProduct(product.name, ourPrice); }} className="p-2 sm:p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors" title="WhatsApp Order">
            <Zap size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-2 sm:mt-3 text-[10px] sm:text-xs text-green-600 font-medium"><TruckIcon size={10} /> Free Shipping</div>
      </div>
    </div>
  );
}