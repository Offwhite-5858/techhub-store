"use client";

import { useState, useEffect } from "react";
import { Trash2, Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/whatsapp";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(Array.isArray(saved) ? saved : []);
    } catch (e) {
      setCart([]);
    }
    setLoaded(true);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
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

  if (!loaded) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen pt-40 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <span className="text-7xl block mb-6">🛒</span>
          <h1 className="text-3xl font-bold text-dark-900 mb-3">Your cart is empty</h1>
          <p className="text-dark-500 mb-8">Add some products to get started.</p>
          <a href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-dark-900 text-white font-semibold rounded-2xl">
            <ArrowLeft size={18} /> Browse Products
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-40 pb-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">Shopping Cart</h1>
            <p className="text-dark-500 text-sm mt-1">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <a href="/products" className="text-dark-500 hover:text-brand-600 text-sm font-medium flex items-center gap-1">
            <ArrowLeft size={16} /> Continue Shopping
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-4 items-center border">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📱</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark-900 text-sm truncate">{item.name}</h3>
                  <p className="text-dark-900 font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 bg-gray-50 rounded-lg"><Minus size={14} /></button>
                  <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 bg-gray-50 rounded-lg"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border h-fit">
            <h2 className="font-bold text-dark-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-dark-500">Shipping</span><span className="text-green-600">Free</span></div>
              <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            </div>
            <a href="/checkout" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-dark-900 text-white font-semibold rounded-2xl">
              Checkout <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}