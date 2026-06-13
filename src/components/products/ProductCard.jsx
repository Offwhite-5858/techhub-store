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
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300 flex flex-col">
      {/* Image Area - responsive height based on screen */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl sm:text-6xl md:text-7xl group-hover:scale-105 transition-transform duration-500">
              {category === "phones" ? "📱" : category === "laptops" ? "💻" : category === "accessories" ? "🎧" : "⌚"}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {badge && (
            <span className="bg-dark-900 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
          {savings > 0 && (
            <span className="bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full">
              -{savingsPercent}%
            </span>
          )}
        </div>

        <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 relative z-20">
        <p className="text-[10px] sm:text-xs font-semibold text-brand-600 uppercase tracking-wider mb-0.5">
          {brand}
        </p>
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-dark-900 mb-0.5 leading-snug hover:text-brand-600 transition-colors line-clamp-2 text-xs sm:text-sm"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="text-accent-400 fill-accent-400" />
          ))}
          <span className="text-[10px] text-dark-400 ml-0.5">(24)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-sm sm:text-base font-bold text-dark-900">{formatPrice(ourPrice)}</span>
          {marketPrice > ourPrice && (
            <span className="text-[10px] sm:text-xs text-dark-400 line-through">{formatPrice(marketPrice)}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-1.5 mt-auto">
          <button
            onClick={addToCart}
            className={`flex-1 flex items-center justify-center gap-1 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all ${
              added ? "bg-green-500 text-white" : "bg-dark-900 text-white hover:bg-dark-800"
            }`}
          >
            {added ? <Check size={13} /> : <ShoppingCart size={13} />}
            {added ? "Added" : "Add to Cart"}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              orderProduct(product.name, ourPrice);
            }}
            className="p-2 sm:p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            title="WhatsApp Order"
          >
            <Zap size={13} />
          </button>
        </div>

        {/* Free Shipping */}
        <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-xs text-green-600 font-medium">
          <TruckIcon size={10} /> Free Shipping
        </div>
      </div>
    </div>
  );
}