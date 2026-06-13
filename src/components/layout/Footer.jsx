import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import siteConfig from "@/data/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tech<span className="text-primary-400">Hub</span></h3>
            <p className="text-gray-400 text-sm">{siteConfig.description}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/products" className="block hover:text-white transition-colors">Products</Link>
              <Link href="#" className="block hover:text-white transition-colors">About Us</Link>
              <Link href="#" className="block hover:text-white transition-colors">Contact</Link>
              <Link href="#" className="block hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={14} /> {siteConfig.contact.phone}</a>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={14} /> {siteConfig.contact.email}</a>
              <span className="flex items-center gap-2"><MapPin size={14} /> {siteConfig.contact.address}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">Get the latest deals and new arrivals.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-l-xl text-sm outline-none focus:border-primary-500" />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-r-xl text-sm font-medium hover:bg-primary-700 transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TechHub Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}