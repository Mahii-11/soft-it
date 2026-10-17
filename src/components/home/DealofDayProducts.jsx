import { useEffect, useState, useRef } from "react";
import { getDealofDayProducts } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import CartPopup from "../CartPopup";
import {
  ShoppingCart,
  Eye,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import Swiper React components and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function DealofDayProducts() {
  const dispatch = useDispatch();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);

  // States to explicitly hide/show navigation arrows at edges
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        const { flashSale, products } = await getDealofDayProducts();
        setDeal(
          flashSale?.is_running && products.length > 0
            ? { ...flashSale, products }
            : null
        );
      } catch (error) {
        console.error("Error fetching deal products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealProducts();
  }, []);

  // single product: offer_price (if any) over regular price
  // variable product: starts from min_price
  function getPrices(product) {
    if (product.type === "variable") {
      return { current: product.min_price, original: null };
    }
    const current = product.offer_price ?? product.price;
    const original =
      product.offer_price != null && product.offer_price < product.price
        ? product.price
        : null;
    return { current, original };
  }

  function handleAddToCart(e, product) {
    e.stopPropagation();

    if (product.type === "variable") {
      navigate(`/product-details/${product.slug}`);
      return;
    }

    const { current } = getPrices(product);
    const normalizedProduct = normalizeProductForCart({
      ...product,
      discount_price: current,
    });
    dispatch(addItem(normalizedProduct));

    setCartPopup({
      image: product.image,
      price: current,
    });

    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  }

  if (loading) return <Loader type="dealofday" count={5} />;

  if (!deal || !deal.products || deal.products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-lg font-medium">
        No deals available.
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* HOT SALE স্ট্রিপের অ্যানিমেশন */
        .marquee-track {
          width: max-content;
          animation: dealmove 8s linear infinite;
        }
        .sale-item {
          color: white;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2px;
          flex-shrink: 0;
        }
        @keyframes dealmove {
          0% { transform: translateX(0) }
          100% { transform: translateX(-35%) }
        }
      `}</style>

      <section className="bg-white py-3 md:py-5 overflow-hidden select-none">
        <div className="max-w-[1400px] mx-auto px-3 md:px-5">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-4 md:mb-6">
            <div>
              <p className="text-[11px] sm:text-xs md:text-[13px] uppercase tracking-[3px] text-red-500 font-semibold mb-1">
                Limited Time Offer
              </p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-800 tracking-tight">
                {deal.title}
              </h2>
            </div>

            <Link
              to="/shop"
              className="text-sm font-medium text-neutral-600 hover:text-red-500 transition shrink-0"
            >
              View All
            </Link>
          </div>

          {/* Swiper Carousel Container */}
          <div className="relative w-full group/carousel">
            {/* দুই পাশের প্রিমিয়াম ফেড ইফেক্ট শ্যাডো */}
            <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Custom Left Arrow Navigation Button */}
            <button
              ref={prevRef}
              className={`absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-white border border-neutral-200 p-1.5 md:p-2 rounded-full z-20 shadow-md active:scale-95 text-neutral-700 transition-opacity duration-200 hover:bg-neutral-50 ${
                isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Custom Right Arrow Navigation Button */}
            <button
              ref={nextRef}
              className={`absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-white border border-neutral-200 p-1.5 md:p-2 rounded-full z-20 shadow-md active:scale-95 text-neutral-700 transition-opacity duration-200 hover:bg-neutral-50 ${
                isEnd ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <ChevronRight size={16} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay, A11y]}
              speed={600}
              slidesPerGroup={1}
              watchOverflow={true}
              grabCursor={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();

                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              breakpoints={{
                320: {
                  slidesPerView: 2.15,
                  spaceBetween: 10,
                },
                480: {
                  slidesPerView: 2.25,
                  spaceBetween: 12,
                },
                640: {
                  slidesPerView: 2.8,
                  spaceBetween: 14,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 12,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 14,
                },
                1280: {
                  slidesPerView: 6,
                  spaceBetween: 16,
                },
              }}
              className="py-2"
            >
              {deal.products.map((product, i) => {
                const { current, original } = getPrices(product);
                return (
                <SwiperSlide key={product.id || i} className="h-auto">
                  <div
                    data-slider-card
                    className="group relative w-full bg-white rounded-xl md:rounded-2xl border border-neutral-200/80 hover:border-[#f3a47b]/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_18px_rgba(243,164,123,0.10)] transition-all duration-300 p-2 md:p-3 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Ribbon Badge */}
                    <div className="absolute top-0 left-0 bg-rose-600 text-white text-[7px] md:text-[9px] py-[3px] px-2 font-bold uppercase tracking-wide rounded-br-2xl shadow-sm z-10">
                      -{deal.offer_percent}% OFF
                    </div>

                    <div>
                      {/* Product Image */}
                      <Link to={`/product-details/${product.slug}`}>
                        <div className="h-[95px] sm:h-[120px] md:h-[140px] lg:h-[150px] flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 mt-1.5">
                          <img
                            src={product.image || "/images/motorola.png"}
                            alt={product.name}
                            draggable={false}
                            className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/motorola.png";
                            }}
                          />
                        </div>
                      </Link>

                      {/* Hot Sale Strip */}
                      <div className="mt-1 bg-[#171717] rounded-xl overflow-hidden h-7 sm:h-8 flex items-center px-2">
                        <div className="marquee-track flex items-center whitespace-nowrap">
                          <span className="sale-item">{deal.offer_percent}% OFF</span>
                          <Zap
                            size={11}
                            className="text-red-500 fill-red-500 mx-1.5 shrink-0"
                          />
                          <span className="sale-item">HOT SALE</span>
                          <Zap
                            size={11}
                            className="text-red-500 fill-red-500 mx-1.5 shrink-0"
                          />
                          <span className="sale-item">LIMITED OFFER</span>
                          <Zap
                            size={11}
                            className="text-red-500 fill-red-500 mx-1.5 shrink-0"
                          />
                          <span className="sale-item">SAVE NOW</span>
                        </div>
                      </div>

                      {/* Name */}
                      <Link to={`/product-details/${product.slug}`}>
                        <h3 className="mt-1 text-[10px] sm:text-xs md:text-[13px] font-semibold text-neutral-800 text-center line-clamp-2 min-h-[28px] md:min-h-[34px] px-1 group-hover:text-black transition">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Price and Action Button Footer */}
                    <div className="mt-1.5 flex flex-col gap-2">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        {original && (
                          <span className="text-neutral-400 line-through text-[11px] md:text-xs">
                            ৳ {Number(original).toLocaleString()}
                          </span>
                        )}
                        <span className="text-[#e26724] font-bold text-[12px] md:text-sm">
                          {product.type === "variable" && "From "}৳{" "}
                          {Number(current ?? 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Premium Action Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full h-7 md:h-9 rounded-full bg-white border border-[#f5ccb7] hover:bg-[#e26724] text-[#e26724] hover:text-white flex items-center justify-center gap-1 text-[10px] md:text-xs font-semibold transition-all duration-300 shadow-[0_2px_6px_rgba(243,164,123,0.06)] active:scale-[0.98]"
                      >
                        {product.type !== "variable" ? (
                          <>
                            <ShoppingCart size={12} className="shrink-0" />
                            <span>Add to Cart</span>
                          </>
                        ) : (
                          <>
                            <Eye size={12} className="shrink-0" />
                            <span>View Details</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>

      <CartPopup popup={cartPopup} onClose={() => setCartPopup(null)} />
    </>
  );
}