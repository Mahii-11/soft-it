import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const FALLBACK_IMAGE = "/images/motorola.png";

export const formatPrice = (value) => `৳${Number(value ?? 0).toLocaleString()}`;

// single product: offer_price (if any) over regular price
// variable product: starts from min_price
export function getProductPrices(product) {
  if (product.type === "variable") {
    return { current: product.min_price, original: null, save: 0 };
  }
  const current = product.offer_price ?? product.price;
  const hasOffer =
    product.offer_price != null && product.price != null && product.offer_price < product.price;
  return {
    current,
    original: hasOffer ? product.price : null,
    save: hasOffer ? product.price - product.offer_price : 0,
  };
}

export default function ProductCard({ product }) {
  const { current, original, save } = getProductPrices(product);

  return (
    <Link
      to={`/product-details/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
    >
      {save > 0 && (
        <div className="flex items-center justify-center gap-1 bg-[#3e4045] py-1.5 text-[10px] font-semibold text-white sm:text-[11px]">
          <span>Save ৳</span>
          <span className="text-yellow-400">{Number(save).toLocaleString()}</span>
          <span>Today!</span>
          <Zap size={10} className="fill-yellow-400 text-yellow-400" />
        </div>
      )}

      <div className="flex aspect-square items-center justify-center bg-[#f6f6f6] p-3 sm:p-4">
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 px-3 pb-3 pt-3">
        <h3 className="line-clamp-2 min-h-[32px] font-sans text-[11px] font-medium leading-4 text-neutral-900 sm:text-xs">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-sm font-bold text-neutral-900 sm:text-base">
            {product.type === "variable" && "From "}
            {formatPrice(current)}
          </span>
          {original && (
            <span className="text-[10px] text-neutral-400 line-through sm:text-[11px]">
              {formatPrice(original)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
