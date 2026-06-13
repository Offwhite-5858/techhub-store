"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/whatsapp";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
    setLoading(false);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  if (loading) {
    return (
      <main className="min-h-screen pt-20 sm:pt-24">
        <LoadingSpinner />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-5xl sm:text-7xl block mb-4 sm:mb-6">🛒</span>
          <h1 className="text-xl sm:text-3xl font-bold text-dark-900 mb-2 sm:mb-3">Your cart is empty</h1>
          <p className="text-dark-500 text-sm mb-6 sm:mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-dark-900 text-white text-sm sm:text-base font-semibold rounded-2xl hover:bg-dark-800 transition-colors">
            <ArrowLeft size={18} /> Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-brand-600 uppercase tracking-wider mb-1">Shopping Cart</p>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-dark-900 tracking-tight">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </h1>
          </div>
          <Link href="/products" className="text-dark-500 hover:text-brand-600 transition-colors flex items-center gap-1 text-xs sm:text-sm font-medium">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex gap-3 sm:gap-4">
                  {/* Product Image - Now shows actual product image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-2xl sm:text-3xl">📦</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark-900 text-sm sm:text-base truncate">{item.name}</h3>
                    <p className="text-brand-600 font-bold text-sm sm:text-base mt-0.5 sm:mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-dark-400 mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-dark-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 sm:w-8 text-center font-semibold text-dark-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-dark-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-xs sm:text-sm text-dark-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 lg:sticky lg:top-28">
              <h2 className="text-base sm:text-lg font-bold text-dark-900 mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-2 sm:space-y-3 text-sm mb-4 sm:mb-6">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-2 sm:pt-3 flex justify-between font-bold text-dark-900 text-sm sm:text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-dark-900 text-white text-sm sm:text-base font-semibold rounded-2xl hover:bg-dark-800 transition-colors"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <div className="mt-4 sm:mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  Free shipping on all orders
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  1 year warranty included
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  7-day easy returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}