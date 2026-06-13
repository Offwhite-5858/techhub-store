import { Truck, Shield, RotateCcw, HeadphonesIcon, BadgePercent, Zap } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "Free delivery nationwide on all orders. No minimum purchase required." },
  { icon: Shield, title: "1 Year Warranty", desc: "Every product comes with a full 12-month warranty for peace of mind." },
  { icon: RotateCcw, title: "7-Day Returns", desc: "Not satisfied? Return any product within 7 days for a full refund." },
  { icon: BadgePercent, title: "Best Prices", desc: "We beat market prices by up to 25%. Find a lower price? We'll match it." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Our team is available around the clock via WhatsApp, phone, or email." },
  { icon: Zap, title: "Fast Processing", desc: "Orders processed within 2 hours. Get your items delivered in 1-3 days." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-dark-900 mb-4">Why Shop With Us</h2>
          <p className="text-dark-500 max-w-xl mx-auto">We make tech shopping easy, affordable, and trustworthy</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow text-center group">
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-dark-500 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}