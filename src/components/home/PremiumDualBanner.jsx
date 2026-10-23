const banners = [
  { href: "/shop/airpods", src: "/images/bann-1.png", alt: "AirPods Pro 3 Offer Banner" },
  { href: "/shop/apple-watch", src: "/images/bann.png", alt: "Apple Watch Series 11 Offer Banner" },
];

export default function PremiumDualBanner() {
  return (
    <section className="container-custom select-none py-4 md:py-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        {banners.map((banner) => (
          <a
            key={banner.href}
            href={banner.href}
            className="group block overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
          >
            <img
              src={banner.src}
              alt={banner.alt}
              draggable={false}
              className="aspect-[2.4/1] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] max-sm:aspect-[2/1]"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
