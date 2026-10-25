import { ShieldCheck, CreditCard, RefreshCw, Truck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    text: "Trusted Products",
    color: "text-emerald-600",
    glow: "from-emerald-100/70",
    iconHover: "group-hover:bg-emerald-50 group-hover:shadow-emerald-200",
    bar: "from-emerald-400 to-teal-500",
  },
  {
    icon: CreditCard,
    title: "EMI Facility",
    text: "Up to 12 Months",
    color: "text-blue-600",
    glow: "from-blue-100/70",
    iconHover: "group-hover:bg-blue-50 group-hover:shadow-blue-200",
    bar: "from-blue-400 to-indigo-500",
  },
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    text: "Best Value Offer",
    color: "text-purple-600",
    glow: "from-purple-100/70",
    iconHover: "group-hover:bg-purple-50 group-hover:shadow-purple-200",
    bar: "from-purple-400 to-fuchsia-500",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "Nationwide Shipping",
    color: "text-orange-600",
    glow: "from-orange-100/70",
    iconHover: "group-hover:bg-orange-50 group-hover:shadow-orange-200",
    bar: "from-orange-400 to-red-500",
  },
];

export default function WhyShopWithUs() {
  return (
    <section className="mt-6 bg-white py-6 md:py-8">
      <div className="container-custom grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text, color, glow, iconHover, bar }) => (
          <div
            key={title}
            className="group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-2xl border border-neutral-100 bg-white px-4 py-4 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
          >
            {/* soft corner glow */}
            <span
              className={`pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-tl ${glow} to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100`}
            />

            <div
              className={`relative mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${iconHover} ${color}`}
            >
              <Icon size={20} className="transition-transform duration-500 group-hover:rotate-[8deg]" />
            </div>
            <h3 className="relative font-sans text-sm font-bold uppercase tracking-wide text-neutral-900">{title}</h3>
            <p className="relative mt-1 text-xs text-neutral-500 transition-colors duration-300 group-hover:text-neutral-700">
              {text}
            </p>

            {/* bottom accent bar */}
            <span
              className={`absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r ${bar} transition-all duration-300 group-hover:w-14`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
