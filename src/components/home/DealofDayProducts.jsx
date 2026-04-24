import { useEffect, useState } from "react";
import { getDealofDayProducts } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import CartPopup from "../CartPopup";
import { ShoppingCart, Eye, Zap } from "lucide-react";

export default function DealofDayProducts() {
  const dispatch = useDispatch();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        const data = await getDealofDayProducts();
        setDeal(data[0] || null);
      } catch (error) {
        console.error("Error fetching deal products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealProducts();
  }, []);

  if (loading) return <Loader type="dealofday" count={5} />;

  if (!deal) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg font-medium">
        No deals available.
      </div>
    );
  }

  function handleAddToCart(e, product) {
    e.stopPropagation();

    if (product.product_type === "variable") {
      navigate(`/product-details/${product.product_slug}`);
      return;
    }

    const normalizedProduct = normalizeProductForCart(product);
    dispatch(addItem(normalizedProduct));

    setCartPopup({
      image: product.thumb_image,
      price: product.discount_price,
    });

    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  }

  return (
    <>
      <section className="bg-white py-10 md:py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[3px] text-red-500 font-semibold mb-2">
                Limited Time Offer
              </p>

              <h2 className="text-3xl md:text-5xl font-light text-black tracking-tight leading-none">
                {deal.deal_title}
              </h2>
            </div>

            <Link
              to="/shop"
              className="text-sm md:text-base text-black font-medium underline underline-offset-4 hover:text-red-500 transition"
            >
              View All
            </Link>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {deal.products?.map((product, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 p-3 md:p-4"
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-20 bg-red-500 text-white text-[11px] md:text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  -{deal.deal_offer}%
                </div>

                <Link to={`/product-details/${product.product_slug}`}>
                  {/* Product Image */}
                  <div className="h-[150px] md:h-[180px] flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-3">
                    <img
                      src={product.thumb_image || "/images/motorola.png"}
                      alt={product.product_name}
                      className="max-h-full object-contain transition duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/motorola.png";
                      }}
                    />
                  </div>

                    {/* Hot Sale Strip */}
                  <div className="mt-3 bg-[#171717] rounded-xl overflow-hidden h-8 sm:h-11 flex items-center px-2 ">
                    <div className="marquee-track flex items-center whitespace-nowrap ">
                      <span className="sale-item">
                        {deal.deal_offer}% OFF
                      </span>

                      <Zap
                        size={15}
                        className="text-red-500 fill-red-500 mx-2 sm:mx-3 shrink-0"
                      />

                      <span className="sale-item">
                        HOT SALE
                      </span>

                      <Zap
                        size={15}
                        className="text-red-500 fill-red-500 mx-2 sm:mx-3 shrink-0"
                      />

                      <span className="sale-item">
                        LIMITED OFFER
                      </span>

                      <Zap
                        size={15}
                        className="text-red-500 fill-red-500 mx-2 sm:mx-3 shrink-0"
                      />

                      <span className="sale-item">
                        SAVE NOW
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="mt-4 text-[15px] md:text-[17px] font-medium leading-snug text-[#222] line-clamp-2 min-h-[62px] md:min-h-[72px] group-hover:text-black transition">
                    {product.product_name}
                  </h3>

                  {/* Price */}
                  <div className="mt-3 flex flex-col gap-1">
                    {product?.original_price && (
                      <span className="text-[#9f9f9f] line-through text-sm">
                        ৳
                        {Number(
                          product.original_price ?? 0
                        ).toLocaleString()}
                      </span>
                    )}

                    <span className="text-black font-semibold text-lg md:text-xl">
                      ৳
                      {Number(
                        product.discount_price ?? 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </Link>

                {/* Hover Button Desktop */}
                <div className="absolute left-3 right-3 bottom-3 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-black hover:bg-white text-white hover:text-black h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition"
                  >
                    {product.product_type === "single" ? (
                      <>
                        <ShoppingCart size={16} />
                        Add to Cart
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        View Details
                      </>
                    )}
                  </button>
                </div>

                {/* Mobile Button */}
                <div className="mt-4 md:hidden">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-black hover:bg-white text-white hover:text-black h-9 rounded-xl text-sm font-medium transition"
                  >
                    {product.product_type === "single"
                      ? "Add to Cart"
                      : "View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .marquee-track{
            width:max-content;
            animation:dealmove 8s linear infinite;
          }

          .sale-item{
            color:white;
            font-size:13px;
            font-weight:700;
            letter-spacing:.4px;
            flex-shrink:0;
          }

          @keyframes dealmove{
            0%{transform:translateX(0)}
            100%{transform:translateX(-35%)}
          }
        `}</style>
      </section>

      <CartPopup
        popup={cartPopup}
        onClose={() => setCartPopup(null)}
      />
    </>
  );
}