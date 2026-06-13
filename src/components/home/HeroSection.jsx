"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Star, Truck, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import siteConfig from "@/data/siteConfig";
import { fetchHero } from "@/lib/api";

export default function HeroSection() {
  const [hero, setHero] = useState({
    headline: "Premium tech, unbeatable prices",
    subheadline: "Cutting-edge devices with warranty and free delivery. Same quality as retail — at prices that make sense.",
    hero_image_url: "",
  });

  useEffect(() => {
    async function load() {
      const data = await fetchHero();
      if (data) setHero(data);
    }
    load();
  }, []);

  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center bg-dark-900 overflow-hidden">
      {/* Hero Background Image */}
      {hero.hero_image_url && (
        <div className="absolute inset-0 z-0">
          <img src={hero.hero_image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark-900/70" />
        </div>
      )}

      {/* Dot pattern overlay */}
      {!hero.hero_image_url && (
        <>
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          </div>
          <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-brand-600/20 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-accent-500/10 rounded-full blur-[60px] sm:blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative">
              <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">📱</span>
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-xl">
                <p className="text-[10px] sm:text-xs text-dark-500 font-medium">From</p>
                <p className="text-base sm:text-xl font-bold text-dark-900">₦35K</p>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-green-500 text-white rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-xl">
                <p className="text-[10px] sm:text-xs font-medium opacity-90">Shipping</p>
                <p className="text-base sm:text-lg font-bold">Free</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6"
            >
              <Sparkles size={12} className="text-accent-400" />
              <span className="text-white/80 text-xs sm:text-sm font-medium">Premium Tech • Trusted by 500+</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight"
            >
              {hero.headline.includes("unbeatable") ? (
                <>
                  Premium tech,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-300">
                    unbeatable prices
                  </span>
                </>
              ) : (
                hero.headline
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-sm sm:text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8"
            >
              {hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8 sm:mb-10"
            >
              <Link href="/products" className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-dark-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-lg shadow-2xl shadow-white/10">
                Browse Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-center text-sm sm:text-lg">
                WhatsApp Order
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start text-white/50 text-xs sm:text-sm"
            >
              <span className="flex items-center gap-1"><Star size={12} className="text-accent-400 fill-accent-400" /> 4.8 Rating</span>
              <span className="flex items-center gap-1"><Truck size={12} /> Free Delivery</span>
              <span className="flex items-center gap-1"><Shield size={12} /> Warranty</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}