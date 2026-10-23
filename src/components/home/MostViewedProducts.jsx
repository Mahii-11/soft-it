import { Link } from "react-router-dom";
import { getMostViewedProducts } from "../../services/api";
import useApiData from "../../hooks/useApiData";
import ProductSlider, { ProductSliderSkeleton } from "./ProductSlider";

const TRENDING_BREAKPOINTS = {
  320: { slidesPerView: 2.1, spaceBetween: 10 },
  640: { slidesPerView: 3.2, spaceBetween: 12 },
  1024: { slidesPerView: 3, spaceBetween: 12 },
};

export default function MostViewedProducts() {
  const { data, loading } = useApiData("most-viewed", getMostViewedProducts);
  const products = data ?? [];

  if (!loading && products.length === 0) return null;

  return (
    <section className="container-custom py-4 md:py-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-5">
        <Link
          to="/shop"
          className="group hidden overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] sm:block"
        >
          <img
            src="/images/banner%20square.jpg"
            alt="Special offer banner"
            draggable={false}
            className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </Link>

        <div className="min-w-0">
          <h2 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
            Trending Products
          </h2>
          {loading ? (
            <ProductSliderSkeleton count={3} />
          ) : (
            <ProductSlider products={products} breakpoints={TRENDING_BREAKPOINTS} />
          )}
        </div>
      </div>
    </section>
  );
}
