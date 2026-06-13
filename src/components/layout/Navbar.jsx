"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Phone, Menu, X, Truck, Shield, RotateCcw, Sparkles } from "lucide-react";
import siteConfig from "@/data/siteConfig";
import { fetchSiteSettings } from "@/lib/api";

const navLinks = [
    { name: "Home", href: "/" },
  { name: "Phones", href: "/products?category=phones" },
  { name: "Laptops", href: "/products?category=laptops" },
  { name: "Audio", href: "/products?category=accessories" },
  { name: "Wearables", href: "/products?category=smart-devices" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [announcement, setAnnouncement] = useState({ active: false, text: "" });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  useEffect(() => {
    async function load() {
      const data = await fetchSiteSettings();
      if (data) {
        setAnnouncement({
          active: data.announcement_active || false,
          text: data.announcement_text || "",
        });
      }
    }
    load();
  }, []);

  return (
    <>
      {/* Trust Bar */}
      <div className="bg-dark-900 text-white/90 text-[11px] sm:text-xs py-1.5 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 sm:gap-10">
          <span className="flex items-center gap-1"><Truck size={11} /> Free Shipping Nationwide</span>
          <span className="flex items-center gap-1"><Shield size={11} /> 1 Year Warranty</span>
          <span className="flex items-center gap-1"><RotateCcw size={11} /> 7-Day Returns</span>
        </div>
      </div>

      {/* Sticky Main Navbar */}
      <header className="sticky top-0 z-50 w-full">
        <div className={`transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-md" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-dark-900 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-all duration-300 group-hover:scale-110">
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="font-bold text-base sm:text-lg text-dark-900 tracking-tight">
                  Tech<span className="text-brand-600">Hub</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="px-3 py-2 text-sm font-medium text-dark-600 hover:text-dark-900 hover:bg-dark-50 rounded-lg transition-all duration-200">
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <a href={`tel:${siteConfig.contact.phone}`} className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium text-dark-600 hover:text-brand-600 transition-colors">
                  <Phone size={14} /> {siteConfig.contact.phone}
                </a>
                <Link href="/cart" className="relative p-1.5 sm:p-2 text-dark-600 hover:text-brand-600 transition-colors">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-brand-600 text-white text-[9px] sm:text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-1.5 text-dark-600 hover:bg-dark-50 rounded-lg transition-colors">
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 border-t border-dark-100" : "max-h-0"}`}>
            <div className="bg-white px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-dark-700 font-medium hover:bg-dark-50 rounded-xl text-sm transition-colors">
                  {link.name}
                </Link>
              ))}
              <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-2 px-3 py-2.5 text-dark-600 text-sm font-medium">
                <Phone size={14} /> {siteConfig.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Announcement Bar — Below navbar, scrolls away */}
      {announcement.active && announcement.text && (
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white text-center text-xs sm:text-sm py-2 px-4 font-medium">
          {announcement.text}
        </div>
      )}
    </>
  );
}