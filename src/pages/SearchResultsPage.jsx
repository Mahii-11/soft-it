import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getsearchProducts } from "../services/api";
import Loader from "../loader/Loader";
import ProductCard from "../components/ProductCard";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
