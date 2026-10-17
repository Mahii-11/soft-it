import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMostViewedProducts } from "../../services/api";
import Loader from "../../loader/Loader";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import CartPopup from "../CartPopup";

// Import Swiper React components and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const transformProducts = (apiProducts) => {
  if (!Array.isArray(apiProducts)) return [];

  return apiProducts.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    thumb_image: item.image,
    product_type: item.type,
    product_slug: item.slug,
    original_price: item.price,
    discount_price: item.offer_price ?? item.price,
    price: item.offer_price ?? item.price ?? 0,
    min_price: item.min_price ?? null,
    max_price: item.max_price ?? null,
  }));
};

export default function MostViewedProducts() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getMostViewedProducts();

        setProducts(transformProducts(res));
      } catch (error) {
        console.error("Error fetching most viewed products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (product.product_type === "variable") {
      navigate(`/product-details/${product.product_slug}`);
      return;
    }

    const normalizedProduct = normalizeProductForCart(product);
    dispatch(addItem(normalizedProduct));

    setCartPopup({
      image: product.thumb_image || product.image,
      price: product.discount_price || product.price,
    });

    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  };

  if (loading) return <Loader type="mostviewed" />;
  if (products.length === 0) return null;

  return (
    <>
      <section className="w-full py-4 md:py-6 bg-white overflow-hidden select-none">
        <div className="max-w-[1400px] mx-auto px-3 md:px-5">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-4 md:mb-6">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[3px] text-red-600 font-semibold mb-1">
                Trending Now
              </p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-800 tracking-tight">
                Most Viewed Products
              </h2>
            </div>

            <Link
              to="/shop"
              className="text-sm font-medium text-neutral-600 hover:text-red-600 transition shrink-0"
            >
              View All
            </Link>
          </div>

          {/* Swiper Carousel Container */}
          <div className="relative w-full group/carousel">
            <button
              ref={prevRef}
              className={`absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-white border border-neutral-200 p-1.5 md:p-2 rounded-full z-20 shadow-md active:scale-95 text-neutral-700 transition-opacity duration-200 hover:bg-neutral-50 ${
                isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

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
                320: { slidesPerView: 2.15, spaceBetween: 10 },
                480: { slidesPerView: 2.25, spaceBetween: 12 },
                640: { slidesPerView: 2.8, spaceBetween: 14 },
                768: { slidesPerView: 4, spaceBetween: 12 },
                1024: { slidesPerView: 5, spaceBetween: 14 },
                1280: { slidesPerView: 6, spaceBetween: 16 },
              }}
              className="py-2 !flex items-stretch"
            >
              {products.map((item) => (
                <SwiperSlide key={item.id} className="!h-auto flex">
                  {/* Card Container with Full Height */}
                  <div className="group relative w-full h-full bg-white rounded-xl md:rounded-2xl border border-neutral-200/80 hover:border-[#f3a47b]/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_18px_rgba(243,164,123,0.10)] transition-all duration-300 p-2 md:p-3 flex flex-col justify-between overflow-hidden">
                    {/* Ribbon Badge */}
                    <div className="absolute top-0 left-0 bg-rose-600 text-white text-[7px] md:text-[9px] py-[3px] px-2 font-bold uppercase tracking-wide rounded-br-2xl shadow-sm z-10">
                      Most View
                    </div>

                    <div className="flex flex-col flex-grow">
                      {/* Image Box */}
                      <div className="h-[95px] sm:h-[120px] md:h-[140px] lg:h-[150px] flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 mt-1.5 shrink-0">
                        <img
                          loading="lazy"
                          src={item.image}
                          alt={item.name}
                          draggable={false}
                          className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Product Name Fixed Height Container */}
                      <div className="mt-2 h-[32px] md:h-[40px] flex items-center justify-center">
                        <h3 className="text-[10px] sm:text-xs md:text-[13px] font-semibold text-neutral-800 text-center line-clamp-2 px-1 group-hover:text-black transition">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    {/* Pricing and Button Footer Container */}
                    <div className="mt-2 flex flex-col gap-2 shrink-0">
                      {/* Price Matrix */}
                      <div className="min-h-[32px] md:min-h-[36px] flex flex-col items-center justify-center gap-0.5">
                        {item.product_type === "variable" && item.min_price && item.max_price ? (
                          /* Variable Product Price Range */
                          <span className="text-[#e26724] font-bold text-[11px] sm:text-[12px] md:text-sm text-center">
                            Tk. {Number(item.min_price).toLocaleString()}
                            {Number(item.max_price) !== Number(item.min_price) && (
                              <> - Tk. {Number(item.max_price).toLocaleString()}</>
                            )}
                          </span>
                        ) : (
                          /* Single Product Regular & Discount Pricing */
                          <>
                            {Number(item.original_price) > 0 &&
                              Number(item.original_price) !== Number(item.discount_price) && (
                                <span className="text-neutral-400 line-through text-[11px] md:text-xs">
                                  Tk. {Number(item.original_price).toLocaleString()}
                                </span>
                              )}
                            <span className="text-[#e26724] font-bold text-[12px] md:text-sm">
                              Tk.{" "}
                              {Number(
                                item.discount_price || item.price || 0
                              ).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Premium Action Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="w-full h-7 md:h-9 rounded-full bg-white border border-[#f5ccb7] hover:bg-slate-900 text-[#e26724] hover:text-white flex items-center justify-center gap-1 text-[10px] md:text-xs font-semibold transition-all duration-300 shadow-[0_2px_6px_rgba(243,164,123,0.06)] active:scale-[0.98]"
                      >
                        {item.product_type === "variable" ? (
                          <>
                            <Eye size={12} className="shrink-0" />
                            <span>View Details</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={12} className="shrink-0" />
                            <span>Add to cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <CartPopup popup={cartPopup} onClose={() => setCartPopup(null)} />
    </>
  );
}