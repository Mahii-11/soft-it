import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getTopPicksProducts } from "../../services/api";
import useApiData from "../../hooks/useApiData";
import ProductCard from "../ProductCard";
import { ProductSliderSkeleton } from "./ProductSlider";

// products shown on the home page; "View More" opens /top-picks with all of them
const HOME_COUNT = 10;

const buttonClass =
  "inline-flex items-center gap-2 rounded bg-[#26282d] px-5 py-2 text-xs font-semibold text-white transition hover:bg-black";

export default function CustomerFavorites() {
  const { data, loading } = useApiData("top-picks", getTopPicksProducts);
  const products = data ?? [];

  if (!loading && products.length === 0) return null;

  return (
    <section className="container-custom scroll-mt-32 py-3 md:py-6">
      <h2 className="mb-4 font-sans text-base font-bold text-neutral-900 md:text-xl">
        Customer Top Picks
      </h2>

      {loading ? (
        <ProductSliderSkeleton count={HOME_COUNT} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.slice(0, HOME_COUNT).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link to="/top-picks" className={buttonClass}>
          View More <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
