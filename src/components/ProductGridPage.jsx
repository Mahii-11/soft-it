import useApiData from "../hooks/useApiData";
import ProductCard from "./ProductCard";

const SKELETON_COUNT = 10;

// Generic "view all" page: title + grid of every product returned by `fetcher`
export default function ProductGridPage({ title, queryKey, fetcher }) {
  const { data, loading, error } = useApiData(queryKey, fetcher);
  const products = Array.isArray(data) ? data : [];

  return (
    <section className="container-custom py-6 md:py-10">
      <h1 className="mb-4 text-xl font-semibold text-[#25282c] md:mb-6 md:text-2xl">{title}</h1>

      {error && !loading ? (
        <p className="py-10 text-center text-neutral-500">
          Failed to load products. Please try again later.
        </p>
      ) : !loading && products.length === 0 ? (
        <p className="py-10 text-center text-neutral-500">No products available right now.</p>
      ) : (
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
      )}
    </section>
  );
}
