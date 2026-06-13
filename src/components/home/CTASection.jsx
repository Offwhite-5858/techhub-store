import { ArrowRight, MessageCircle } from "lucide-react";
import siteConfig from "@/data/siteConfig";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-900 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to Get Yours?</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
          Chat with us on WhatsApp for quick ordering, product questions, or price inquiries. We respond in minutes.
        </p>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%20TechHub!%20I'm%20interested%20in%20your%20products.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all text-lg shadow-lg shadow-green-500/25"
        >
          <MessageCircle size={22} /> Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}