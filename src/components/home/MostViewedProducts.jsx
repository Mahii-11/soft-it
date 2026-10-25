import { getMostViewedProducts } from "../../services/api";
import useApiData from "../../hooks/useApiData";
import ProductSlider, { ProductSliderSkeleton } from "./ProductSlider";

const TRENDING_BREAKPOINTS = {
  320: { slidesPerView: 2.1, spaceBetween: 10 },
  640: { slidesPerView: 3.2, spaceBetween: 12 },
  1024: { slidesPerView: 5, spaceBetween: 12 },
};

export default function MostViewedProducts() {
  const { data, loading } = useApiData("most-viewed", getMostViewedProducts);
  const products = (data ?? []).slice(0, 5);

  if (!loading && products.length === 0) return null;

  return (
    <section className="container-custom py-4 md:py-6">
      <div className="min-w-0">
        <h2 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
          Trending Products
        </h2>
        {loading ? (
          <ProductSliderSkeleton count={5} />
        ) : (
          <ProductSlider products={products} breakpoints={TRENDING_BREAKPOINTS} />
        )}
      </div>
    </section>
  );
}
