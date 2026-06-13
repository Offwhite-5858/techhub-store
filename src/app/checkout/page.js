"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Truck, Shield } from "lucide-react";
import { formatPrice, orderCart } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    orderCart(cart, total, form.name, form.phone, form.address);
    setSubmitted(true);
    localStorage.setItem("cart", "[]");
    window.dispatchEvent(new Event("storage"));
  };

  if (cart.length === 0 && !submitted) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-7xl block mb-6">🛒</span>
          <h1 className="text-2xl font-bold text-dark-900 mb-3">No items to checkout</h1>
          <Link href="/products" className="text-brand-600 font-medium hover:underline">Browse Products →</Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-dark-900 mb-3">Order Sent!</h1>
          <p className="text-dark-500 mb-8">
            Your order has been sent to WhatsApp. We&apos;ll confirm and process it within minutes.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-dark-900 text-white font-semibold rounded-2xl hover:bg-dark-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="text-dark-500 hover:text-brand-600 transition-colors flex items-center gap-1 text-sm font-medium mb-8">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                <h2 className="font-semibold text-dark-900">Delivery Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-500 outline-none text-sm transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">Phone Number *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-500 outline-none text-sm transition-all" placeholder="+234 800 000 0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">Delivery Address *</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-500 outline-none text-sm transition-all" placeholder="Street address" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">City</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-500 outline-none text-sm transition-all" placeholder="Lagos" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">Order Notes</label>
                    <input type="text" name="notes" value={form.notes} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-500 outline-none text-sm transition-all" placeholder="Optional" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-semibold rounded-2xl hover:bg-green-600 transition-colors text-lg shadow-lg shadow-green-500/25">
                <MessageCircle size={22} /> Place Order via WhatsApp
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-28">
              <h2 className="font-semibold text-dark-900 mb-4">Your Order</h2>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-dark-600 truncate mr-2">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-dark-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm text-dark-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Shipping</span><span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-dark-900 text-lg pt-2 border-t">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <Truck size={14} className="text-green-600" /> Free shipping nationwide
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <Shield size={14} className="text-green-600" /> 1 year warranty included
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}