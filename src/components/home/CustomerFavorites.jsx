import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getMostViewedProducts } from "../../services/api";
import useApiData from "../../hooks/useApiData";
import ProductCard from "../ProductCard";
import { ProductSliderSkeleton } from "./ProductSlider";

const PAGE_SIZE = 10;

const buttonClass =
  "inline-flex items-center gap-2 rounded bg-[#26282d] px-5 py-2 text-xs font-semibold text-white transition hover:bg-black";

export default function CustomerFavorites() {
  const { data, loading } = useApiData("most-viewed", getMostViewedProducts);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const products = data ?? [];

  if (!loading && products.length === 0) return null;

  return (
    <section className="container-custom py-4 md:py-6">
      <h2 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
        Customer Favorites
      </h2>

      {loading ? (
        <ProductSliderSkeleton count={10} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.slice(0, visible).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        {visible < products.length ? (
          <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={buttonClass}>
            View More <ArrowRight size={14} />
          </button>
        ) : (
          <Link to="/shop" className={buttonClass}>
            View More <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </section>
  );
}
