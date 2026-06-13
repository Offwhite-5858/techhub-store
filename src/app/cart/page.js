"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/whatsapp";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
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
  const shipping = 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-7xl block mb-6">🛒</span>
          <h1 className="text-3xl font-bold text-dark-900 mb-3">Your cart is empty</h1>
          <p className="text-dark-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-dark-900 text-white font-semibold rounded-2xl hover:bg-dark-800 transition-colors">
            <ArrowLeft size={18} /> Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-1">Shopping Cart</p>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 tracking-tight">{cart.length} item{cart.length !== 1 ? "s" : ""}</h1>
          </div>
          <Link href="/products" className="text-dark-500 hover:text-brand-600 transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-4 items-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl">
                  📱
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark-900 truncate">{item.name}</h3>
                  <p className="text-brand-600 font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-semibold text-dark-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-dark-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 h-fit sticky top-28">
            <h2 className="text-lg font-bold text-dark-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-dark-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-dark-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-dark-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-dark-900 text-white font-semibold rounded-2xl hover:bg-dark-800 transition-colors"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-dark-400 text-center mt-4">Free shipping on all orders</p>
          </div>
        </div>
      </div>
    </main>
  );
}