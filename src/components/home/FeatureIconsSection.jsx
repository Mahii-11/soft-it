import { Package, Truck, ShieldCheck, Headphones } from "lucide-react";

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: Package,
      title: "100% Authentic Products",
      desc: "We guarantee genuine and official products directly from trusted brands.",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Truck,
      title: "Fast & Reliable Delivery",
      desc: "Lightning fast shipping across the country with real-time tracking.",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "Multiple safe payment methods with complete data protection.",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      desc: "Our support team is always ready to help you anytime.",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Shop {""}<span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">With Us?</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We provide the best shopping experience with high-quality products,
            fast delivery, and trusted customer service.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group bg-gray-50 rounded-2xl p-8 text-center 
                hover:shadow-xl hover:-translate-y-3 
                transition-all duration-500"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 mx-auto flex items-center justify-center 
                  rounded-full ${item.bg} ${item.color}
                  group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-gray-600 text-sm">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-purple-600 text-slate-100 rounded-full 
          hover:bg-purple-400 hover:text-slate-50 transition duration-300 shadow-md">
            Start Shopping
          </button>
        </div>

      </div>
    </section>
  );
}
