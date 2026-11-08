import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getsearchProducts } from "../services/api";
import Loader from "../loader/Loader";
import ProductCard from "../components/ProductCard";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  // শুরুতেই true: নইলে fetch শুরুর আগে এক ঝলক "No products found" দেখা যায়
  const [loading, setLoading] = useState(Boolean(query));

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const result = await getsearchProducts(query);
        setProducts(result);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return <Loader type="dealofday" count={5} />;
  }

  return (
    <div className="bg-[#f0f0f0] py-6">
      <div className="container-custom">
        <h1 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
          Search results for: {query}
        </h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center rounded-md bg-white py-16 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
            <Search className="mb-3 h-12 w-12 text-neutral-300" />
            <h2 className="text-base font-bold text-neutral-900">No products found</h2>
            <p className="mt-1 px-4 text-sm text-neutral-500">
              We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Check the spelling or try a different keyword.
            </p>
            <Link
              to="/"
              className="mt-5 rounded-md bg-[#ea5b3a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d44a2a]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
