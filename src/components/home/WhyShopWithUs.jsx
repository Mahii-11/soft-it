import {
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Truck,
} from "lucide-react";

export default function WhyShopWithUs() {
  const features = [
    {
      id: 1,
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "from-emerald-50 via-white to-emerald-100",
      glow: "group-hover:shadow-emerald-200/70",
      title: "100% Authentic",
      subtitle: "Trusted Products",
    },
    {
      id: 2,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "from-blue-50 via-white to-blue-100",
      glow: "group-hover:shadow-blue-200/70",
      title: "EMI Facility",
      subtitle: "Up to 12 Months",
    },
    {
      id: 3,
      icon: RefreshCw,
      color: "text-purple-600",
      bg: "from-purple-50 via-white to-purple-100",
      glow: "group-hover:shadow-purple-200/70",
      title: "Easy Exchange",
      subtitle: "Best Value Offer",
    },
    {
      id: 4,
      icon: Truck,
      color: "text-orange-600",
      bg: "from-orange-50 via-white to-orange-100",
      glow: "group-hover:shadow-orange-200/70",
      title: "Fast Delivery",
      subtitle: "Nationwide Shipping",
    },
  ];

  return (
    <section className="relative w-full bg-white py-4 md:py-6  overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-rose-100/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-orange-100/20 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-3 md:px-5">
        {/* Heading */}
        <div className="text-center mb-5 md:mb-6">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 mb-2">
            Premium Service
          </span>

          <h2 className="text-lg sm:text-xl md:text-3xl font-black tracking-tight">
            <span className="text-neutral-300 italic block">
              Why Shop
            </span>

            <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent italic">
              With Us?
            </span>
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full mx-auto mt-3" />
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="
                  group
                  relative
                  bg-white/80
                  backdrop-blur-md
                  border border-neutral-100
                  rounded-2xl
                  p-3 
                  text-center
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                {/* Glow Effect */}
                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-500
                    bg-gradient-to-br
                    from-white
                    via-transparent
                    to-rose-50
                  "
                />

                {/* Icon */}
                <div
                  className={`
                    relative
                    mx-auto
                    mb-3
                    w-8 h-8 
                    rounded-2xl
                    bg-gradient-to-br
                    ${item.bg}
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    ${item.glow}
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:rotate-6
                  `}
                >
                  <Icon
                    size={24}
                    strokeWidth={2.2}
                    className={`${item.color} transition-transform duration-500 group-hover:scale-110`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-neutral-900 uppercase tracking-wide">
                  {item.title}
                </h3>

                <p className="mt-1 text-[9px] sm:text-[10px] text-neutral-500 font-medium">
                  {item.subtitle}
                </p>

                {/* Bottom Accent */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    -translate-x-1/2
                    w-0
                    h-1
                    bg-gradient-to-r
                    from-rose-500
                    to-orange-500
                    rounded-full
                    transition-all
                    duration-500
                    group-hover:w-12
                  "
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}