import { getPromoBanners } from "../../services/api";
import useApiData from "../../hooks/useApiData";

export default function PremiumDualBanner() {
  const { data, loading } = useApiData("promo-banners", getPromoBanners);
  const banners = (data ?? []).slice(0, 2);

  if (!loading && banners.length === 0) return null;

  return (
    <section className="container-custom select-none py-3 md:py-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        {loading
          ? [0, 1].map((i) => (
              <div key={i} className="aspect-[2/1] animate-pulse rounded-lg bg-neutral-200" />
            ))
          : banners.map((banner) => (
              <a
                key={banner.id}
                href="/shop-page"
                className="group block overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  draggable={false}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </a>
            ))}
      </div>
    </section>
  );
}
