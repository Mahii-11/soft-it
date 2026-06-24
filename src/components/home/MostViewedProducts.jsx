import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMostViewedProducts } from "../../services/api";
import Loader from "../../loader/Loader";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import CartPopup from "../CartPopup";

const transformProducts = (apiProducts) =>
  apiProducts.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
    product_type: item.product_type,
    product_slug: item.product_slug,
    thumb_image: item.thumb_image,
    discount_price: item.discount_price,
    original_price: item.original_price,
  }));

export default function MostViewedProducts() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);

  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // ১. মোবাইল বাটন ক্লিক ট্র্যাক করার নতুন স্টেট
  const [isManualMode, setIsManualMode] = useState(false);
  
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const currentTranslateX = useRef(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiProducts = await getMostViewedProducts();
        setProducts(transformProducts(apiProducts));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // মোবাইল ভিউ চেকার হেল্পার ফাংশন
  const isMobileView = () => window.innerWidth < 768;

  // ২. মোবাইলের জন্য ম্যানুয়াল স্লাইড করার হ্যান্ডলার ফাংশন
  const handleManualSlide = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    // বাটন ক্লিক করলেই অটো স্লাইড পার্মানেন্টলি অফ করার লজিক
    if (!isManualMode) {
      setIsManualMode(true);
    }

    // সিএসএস কিফ্রেম অ্যানিমেশনের মধ্যবর্তী পজিশন নিখুঁতভাবে রিড করার ম্যাট্রিক্স লজিক
    const computedStyle = window.getComputedStyle(container);
    const matrix = new WebKitCSSMatrix(computedStyle.transform);
    let currentX = matrix.m41; 

    const slideAmount = 220; // ১টি কার্ডের আনুমানিক সাইজ + গ্যাপ
    let targetX = direction === "next" ? currentX - slideAmount : currentX + slideAmount;

    // ইনফিনিট লুপ সীমানা নিয়ন্ত্রণ
    const singleSetWidth = container.scrollWidth / 3;
    if (targetX > 0) {
      targetX = -singleSetWidth;
    } else if (targetX < -singleSetWidth * 2) {
      targetX = -singleSetWidth;
    }

    currentTranslateX.current = targetX;
    
    // ম্যানুয়াল ট্রানজিশন ইফেক্ট চালু করা
    container.style.transition = "transform 0.4s ease-out";
    container.style.transform = `translateX(${targetX}px)`;

    // ড্র্যাগিং এর সাথে কনফ্লিক্ট এড়াতে ট্রানজিশন রিসেট
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.transition = "none";
      }
    }, 400);
  };

  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    const container = sliderRef.current;
    if (!container) return;

    setIsDragging(true);
    setIsPaused(true);
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    // অ্যানিমেশন চলাকালীন কারেন্ট এক্সট্রা পজিশন ডিটেক্ট করা
    const computedStyle = window.getComputedStyle(container);
    const matrix = new WebKitCSSMatrix(computedStyle.transform);
    currentTranslateX.current = matrix.m41;

    dragStart.current = {
      x: clientX,
      scrollLeft: currentTranslateX.current,
    };

    container.style.transition = "none";
    container.style.cursor = "grabbing";
    document.body.style.cursor = "grabbing";
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const container = sliderRef.current;
    if (!container) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStart.current.x;
    
    let targetX = dragStart.current.scrollLeft + deltaX;

    const singleSetWidth = container.scrollWidth / 3;
    if (targetX > 0) {
      targetX = -singleSetWidth;
    } else if (targetX < -singleSetWidth * 2) {
      targetX = -singleSetWidth;
    }

    currentTranslateX.current = targetX;
    container.style.transform = `translateX(${targetX}px)`;
  }, [isDragging]);

  const endDrag = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);

    const container = sliderRef.current;
    if (!container) return;

    container.style.cursor = "grab";
    document.body.style.cursor = "";
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", endDrag);
      window.addEventListener("touchmove", handlePointerMove, { passive: false });
      window.addEventListener("touchend", endDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", endDrag);
    };
  }, [isDragging, handlePointerMove, endDrag]);

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

  const duplicatedProducts = [...products, ...products, ...products];

  return (
    <>
      <style>{`
        @keyframes premiumTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-ticker {
          animation: premiumTicker 45s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <section className="w-full py-8 md:py-12 bg-white overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[3px] text-red-600 font-semibold mb-1">
                Trending Now
              </p>
              <h2 className="text-xl md:text-3xl font-bold text-neutral-800 tracking-tight">
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

          {/* Infinite Carousel Outer Container */}
          <div 
            className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
            // ৩. ইভেন্টে মোবাইল ভিউ কন্ডিশন যোগ করা হয়েছে যেন ফোনে হোভার করলে পজ না হয়
            onMouseEnter={() => !isMobileView() && setIsPaused(true)}
            onMouseLeave={() => !isMobileView() && !isDragging && setIsPaused(false)}
          >
            {/* মোবাইল লেফট এবং রাইট নেভিগেশন বাটন (md:hidden থাকায় ডেক্সটপে আসবে না) */}
            <button 
              onClick={() => handleManualSlide("prev")}
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border border-neutral-200 p-1.5 rounded-full z-20 shadow-md active:scale-95 text-neutral-700"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => handleManualSlide("next")}
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border border-neutral-200 p-1.5 rounded-full z-20 shadow-md active:scale-95 text-neutral-700"
            >
              <ChevronRight size={18} />
            </button>

            <div
              ref={sliderRef}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              className={`flex gap-4 md:gap-5 w-max will-change-transform py-3 ${
                isManualMode || isPaused || isDragging ? "" : "animate-ticker"
              }`}
            >
              {duplicatedProducts.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  data-slider-card
                  className="group relative shrink-0 w-[185px] sm:w-[210px] md:w-[245px] bg-white rounded-3xl border border-neutral-200/80 hover:border-[#f3a47b]/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(243,164,123,0.12)] transition-all duration-300 p-3 md:p-4 flex flex-col justify-between overflow-hidden"
                >
                  {/* Ribbon Badge */}
                  <div className="absolute top-0 left-0 bg-rose-600 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-br-2xl shadow-sm z-10">
                    Most View
                  </div>

                  <div>
                    {/* Image Box */}
                    <div className="h-[150px] md:h-[180px] flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2 mt-2">
                      <img
                        loading="lazy"
                        src={item.image}
                        alt={item.name}
                        draggable={false}
                        className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Name */}
                    <h3 className="mt-2 text-xs md:text-sm font-semibold text-neutral-800 text-center line-clamp-2 min-h-[34px] md:min-h-[40px] px-1 group-hover:text-black transition">
                      {item.name}
                    </h3>
                  </div>

                  {/* Pricing and Button Footer Container */}
                  <div className="mt-4 flex flex-col gap-3">
                    {/* Price Matrix */}
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      {item?.original_price && (
                        <span className="text-neutral-400 line-through text-[11px] md:text-xs">
                          Tk. {Number(item.original_price ?? 0).toLocaleString()}
                        </span>
                      )}
                      <span className="text-[#e26724] font-bold text-sm md:text-base">
                        Tk. {Number(item.discount_price || item.price || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Premium Action Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="w-full h-9 md:h-10 rounded-full bg-white border border-[#f5ccb7] hover:bg-slate-900 text-[#e26724] hover:text-white flex items-center justify-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-300 shadow-[0_2px_6px_rgba(243,164,123,0.06)] active:scale-[0.98]"
                    >
                      {item.product_type === "variable" ? (
                        <>
                          <Eye size={14} className="shrink-0" />
                          <span>View Details</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} className="shrink-0" />
                          <span>Add to cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <CartPopup popup={cartPopup} onClose={() => setCartPopup(null)} />
    </>
  );
}