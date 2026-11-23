import { useEffect, useState } from "react";
import { getAllFlashSaleProducts } from "../services/api";
import useApiData from "../hooks/useApiData";
import ProductCard from "../components/ProductCard";
import { Countdown, toTimestamp } from "../components/home/DealofDayProducts";

const SKELETON_COUNT = 10;

// "Hot Deal" page (header Hot Deal button + Special Offer arrow):
// every flash sale product from all-flash-sale-products, with title + countdown
export default function OnlineSale() {
  const { data, loading, error } = useApiData("all-flash-sale", getAllFlashSaleProducts);
  const [now, setNow] = useState(Date.now());

  const flashSale = data?.flashSale;
  const products = data?.products ?? [];

  // flip to the "ended" message the moment the countdown hits zero
  const endAt = toTimestamp(flashSale?.end_time);
  useEffect(() => {
    if (Number.isNaN(endAt)) return;
    const wait = endAt - Date.now();
    if (wait <= 0) return;
    // setTimeout caps at ~24.8 days; re-check periodically for longer offers
    const t = setTimeout(() => setNow(Date.now()), Math.min(wait, 2 ** 31 - 1));
    return () => clearTimeout(t);
  }, [endAt, now]);

  const ended =
    !loading && (!flashSale?.is_running || products.length === 0 || now >= toTimestamp(flashSale.end_time));

  return (
    <div className="min-h-[60vh] bg-[#f0f0f0] py-3 font-sans md:py-6">
      <section className="container-custom py-3 md:py-6">
        {error && !loading ? (
          <p className="py-10 text-center text-neutral-500">
            Failed to load products. Please try again later.
          </p>
        ) : ended ? (
          <div className="rounded-lg bg-white px-4 py-10 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
            <h2 className="font-sans text-base font-bold text-neutral-900 md:text-xl">
              This offer has ended
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Stay tuned, a new special offer is coming soon.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {loading ? (
                <div className="h-6 w-40 animate-pulse rounded bg-neutral-200" />
              ) : (
                <>
                  <h1 className="font-sans text-base font-bold text-neutral-900 md:text-xl">
                    {flashSale.title || "Gadget Globe Special Deal"}
                  </h1>
                  <Countdown endTime={flashSale.end_time} />
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {loading
                ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                    >
                      <div className="aspect-square bg-gray-200" />
                      <div className="space-y-2 p-3">
                        <div className="h-3 w-full rounded bg-gray-200" />
                        <div className="h-3 w-2/3 rounded bg-gray-200" />
                        <div className="h-4 w-1/3 rounded bg-gray-300" />
                      </div>
                    </div>
                  ))
                : products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
