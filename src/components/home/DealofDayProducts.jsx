import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDealofDayProducts } from "../../services/api";
import useApiData from "../../hooks/useApiData";
import ProductSlider, { ProductSliderSkeleton } from "./ProductSlider";
import SectionHeading from "./SectionHeading";

const FLASH_BREAKPOINTS = {
  320: { slidesPerView: 2, spaceBetween: 8 },
  640: { slidesPerView: 3.2, spaceBetween: 12 },
  1024: { slidesPerView: 3, spaceBetween: 12 },
};

// API sends "YYYY-MM-DD HH:mm:ss"
const toTimestamp = (value) => (value ? new Date(value.replace(" ", "T")).getTime() : NaN);

function Countdown({ endTime }) {
  const end = toTimestamp(endTime);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (Number.isNaN(end)) return null;

  const left = Math.max(0, Math.floor((end - now) / 1000));
  const parts = [
    { value: Math.floor(left / 3600), label: "HRS" },
    { value: Math.floor((left % 3600) / 60), label: "MINS" },
    { value: left % 60, label: "SECS" },
  ];

  return (
    <div className="flex items-center gap-1">
      {parts.map((part, i) => (
        <div key={part.label} className="flex items-center gap-1">
          {i > 0 && <span className="text-sm font-bold text-neutral-700">:</span>}
          <div className="flex h-8 min-w-[34px] flex-col items-center justify-center rounded bg-[#ea5b3a] px-1 leading-none text-white">
            <span className="text-xs font-bold">{String(part.value).padStart(2, "0")}</span>
            <span className="mt-0.5 text-[7px] font-medium">{part.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DealofDayProducts() {
  const { data, loading } = useApiData("flash-sale", getDealofDayProducts);
  const [now, setNow] = useState(Date.now());

  // re-render the moment the countdown hits zero so the section flips to the "ended" message
  const endAt = toTimestamp(data?.flashSale?.end_time);
  useEffect(() => {
    if (Number.isNaN(endAt)) return;
    const wait = endAt - Date.now();
    if (wait <= 0) return;
    // setTimeout caps at ~24.8 days; re-check periodically for longer offers
    const t = setTimeout(() => setNow(Date.now()), Math.min(wait, 2 ** 31 - 1));
    return () => clearTimeout(t);
  }, [endAt, now]);

  if (loading) {
    return (
      <section className="container-custom py-3 md:py-6">
        <ProductSliderSkeleton />
      </section>
    );
  }

  const flashSale = data?.flashSale;
  const products = data?.products ?? [];
  const bannerImage = flashSale?.image || "/images/banner%20square.jpg";
  const bannerAlt = flashSale?.title || "Special offer banner";

  // offer over (not running / time is up / nothing on sale) -> no banner, no products, just a message
  const ended = !flashSale?.is_running || products.length === 0 || now >= toTimestamp(flashSale.end_time);
  if (ended) {
    return (
      <section className="container-custom py-3 md:py-6">
        <div className="rounded-lg bg-white px-4 py-10 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <h2 className="font-sans text-base font-bold text-neutral-900 md:text-xl">
            This offer has ended
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Stay tuned, a new special offer is coming soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-custom py-3 md:py-6">
      <SectionHeading title={flashSale.title || "Gadget Globe Special Deal"} to="/shop-page">
        <Countdown endTime={flashSale.end_time} />
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,0.9fr)] lg:gap-5">
        <div className="min-w-0">
          <ProductSlider products={products} breakpoints={FLASH_BREAKPOINTS} />
        </div>

        <Link
          to="/shop-page"
          className="group hidden overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] sm:block"
        >
          <img
            src={bannerImage}
            alt={bannerAlt}
            draggable={false}
            className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </Link>
      </div>
    </section>
  );
}
