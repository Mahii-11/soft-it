import { ShieldCheck, CreditCard, RefreshCw, Truck } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "100% Authentic", text: "Trusted Products", color: "text-emerald-600" },
  { icon: CreditCard, title: "EMI Facility", text: "Up to 12 Months", color: "text-blue-600" },
  { icon: RefreshCw, title: "Easy Exchange", text: "Best Value Offer", color: "text-purple-600" },
  { icon: Truck, title: "Fast Delivery", text: "Nationwide Shipping", color: "text-orange-600" },
];

export default function WhyShopWithUs() {
  return (
    <section className="mt-6 bg-white py-6 md:py-8">
      <div className="container-custom grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text, color }) => (
          <div
            key={title}
            className="flex flex-col items-center rounded-2xl border border-neutral-100 bg-white px-4 py-4 text-center shadow-sm"
          >
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow ${color}`}>
              <Icon size={20} />
            </div>
            <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-neutral-900">{title}</h3>
            <p className="mt-1 text-xs text-neutral-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
