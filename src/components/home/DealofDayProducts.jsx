import { useEffect, useState, useRef, useCallback } from "react";
import { getDealofDayProducts } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import CartPopup from "../CartPopup";
import { ShoppingCart, Eye, Zap, ChevronLeft, ChevronRight } from "lucide-react";

export default function DealofDayProducts() {
  const dispatch = useDispatch();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);

  // স্লাইডার কন্ট্রোল করার জন্য স্টেট ও রেফারেন্স
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // নতুন স্টেট: ব্যবহারকারী মোবাইল অ্যারো বাটন ক্লিক করেছে কিনা তা ট্র্যাক করার জন্য
  const [isManualMode, setIsManualMode] = useState(false);
  
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const currentTranslateX = useRef(0);

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

  // মোবাইল ভিউ হ্যান্ডেল করার জন্য উইন্ডো সাইজ চেকার হেল্পার
  const isMobileView = () => window.innerWidth < 768;

  // মোবাইল বাটনের সাহায্যে ম্যানুয়াল স্লাইড করার ফাংশন
  const handleManualSlide = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    // ১. প্রথমবার বাটন ক্লিক করলেই অটো-স্লাইড চিরতরে অফ করার জন্য স্টেট চেঞ্জ
    if (!isManualMode) {
      setIsManualMode(true);
    }

    // স্লাইডারে অ্যানিমেশন অন থাকলে কারেন্ট পজিশন ম্যাট্রিক্স থেকে বের করতে হয়
    const computedStyle = window.getComputedStyle(container);
    const matrix = new WebKitCSSMatrix(computedStyle.transform);
    let currentX = matrix.m41; // বর্তমান ট্রান্সলেট X পজিশন

    const slideAmount = 220; // প্রতি ক্লিকে যতটুক সরবে (কার্ড উইডথ + গ্যাপ)
    let targetX = direction === "next" ? currentX - slideAmount : currentX + slideAmount;

    // ইনফিনিট লুপ বাউন্ডারি সেটআপ
    const singleSetWidth = container.scrollWidth / 3;
    if (targetX > 0) {
      targetX = -singleSetWidth;
    } else if (targetX < -singleSetWidth * 2) {
      targetX = -singleSetWidth;
    }

    currentTranslateX.current = targetX;
    
    // বাটন ক্লিকের ট্রানজিশন স্মুথ করার জন্য সিএসএস ট্রানজিশন অন করা
    container.style.transition = "transform 0.4s ease-out";
    container.style.transform = `translateX(${targetX}px)`;

    // ৪০০ মিলিগ্রাম পর ট্রানজিশন অফ করা (যাতে ড্র্যাগিং এ সমস্যা না হয়)
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.transition = "none";
      }
    }, 400);
  };

  // মাউস ড্র্যাগ এবং টাচ সোয়াইপ হ্যান্ডলার
  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    const container = sliderRef.current;
    if (!container) return;

    setIsDragging(true);
    setIsPaused(true);
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    // অ্যানিমেশন বা ম্যানুয়াল মুভমেন্ট চলাকালীন কারেন্ট পজিশন ডিটেক্ট করা
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

  if (loading) return <Loader type="dealofday" count={5} />;

  if (!deal) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg font-medium">
        No deals available.
      </div>
    );
  }

  const duplicatedProducts = deal.products 
    ? [...deal.products, ...deal.products, ...deal.products] 
    : [];

  return (
    <>
      <style>{`
        /* বাম থেকে ডানে (Left to Right) ইনফিনিট মার্কি স্লাইডার অ্যানিমেশন */
        @keyframes reverseTicker {
          0% { transform: translateX(-33.3333%); }
          100% { transform: translateX(0); }
        }
        .animate-reverse-ticker {
          animation: reverseTicker 45s linear infinite;
        }
        
        /* HOT SALE স্ট্রিপের অ্যানিমেশন */
        .marquee-track {
          width: max-content;
          animation: dealmove 8s linear infinite;
        }
        .sale-item {
          color: white;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .4px;
          flex-shrink: 0;
        }
        @keyframes dealmove {
          0% { transform: translateX(0) }
          100% { transform: translateX(-35%) }
        }
      `}</style>

      <section className="bg-white py-4 md:py-8 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[3px] text-red-500 font-semibold mb-1">
                Limited Time Offer
              </p>
              <h2 className="text-xl md:text-3xl font-bold text-neutral-800 tracking-tight">
                {deal.deal_title}
              </h2>
            </div>

            <Link
              to="/shop"
              className="text-sm font-medium text-neutral-600 hover:text-red-500 transition shrink-0"
            >
              View All
            </Link>
          </div>

          {/* Premium Infinite Horizontal Outer Wrapper */}
          <div 
            className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing group/slider"
            onMouseEnter={() => !isMobileView() && setIsPaused(true)}
            onMouseLeave={() => !isMobileView() && !isDragging && setIsPaused(false)}
          >
            {/* দুই পাশের প্রিমিয়াম ফেড ইফেক্ট শ্যাডো */}
            <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* মোবাইল ভিউর জন্য লেফট এবং রাইট অ্যারো বাটন */}
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
                isManualMode || isPaused || isDragging ? "" : "animate-reverse-ticker"
              }`}
            >
              {duplicatedProducts.map((product, i) => (
                <div
                  key={i}
                  data-slider-card
                  className="group relative shrink-0 w-[185px] sm:w-[210px] md:w-[245px] bg-white rounded-3xl border border-neutral-200/80 hover:border-[#f3a47b]/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(243,164,123,0.12)] transition-all duration-300 p-3 md:p-4 flex flex-col justify-between overflow-hidden"
                >
                  {/* Ribbon Badge */}
                  <div className="absolute top-0 left-0 bg-rose-600 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-br-2xl shadow-sm z-10">
                    -{deal.deal_offer}% OFF
                  </div>

                  <div>
                    {/* Product Image */}
                    <Link to={`/product-details/${product.product_slug}`}>
                      <div className="h-[150px] md:h-[170px] flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2 mt-2">
                        <img
                          src={product.thumb_image || "/images/motorola.png"}
                          alt={product.product_name}
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
                    <div className="mt-3 bg-[#171717] rounded-xl overflow-hidden h-8 sm:h-10 flex items-center px-2">
                      <div className="marquee-track flex items-center whitespace-nowrap">
                        <span className="sale-item">{deal.deal_offer}% OFF</span>
                        <Zap size={13} className="text-red-500 fill-red-500 mx-2 shrink-0" />
                        <span className="sale-item">HOT SALE</span>
                        <Zap size={13} className="text-red-500 fill-red-500 mx-2 shrink-0" />
                        <span className="sale-item">LIMITED OFFER</span>
                        <Zap size={13} className="text-red-500 fill-red-500 mx-2 shrink-0" />
                        <span className="sale-item">SAVE NOW</span>
                      </div>
                    </div>

                    {/* Name */}
                    <Link to={`/product-details/${product.product_slug}`}>
                      <h3 className="mt-3 text-xs md:text-sm font-semibold text-neutral-800 text-center line-clamp-2 min-h-[34px] md:min-h-[40px] px-1 group-hover:text-black transition">
                        {product.product_name}
                      </h3>
                    </Link>
                  </div>

                  {/* Price and Action Button Footer */}
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      {product?.original_price && (
                        <span className="text-neutral-400 line-through text-[11px] md:text-xs">
                          ৳ {Number(product.original_price ?? 0).toLocaleString()}
                        </span>
                      )}
                      <span className="text-[#e26724] font-bold text-sm md:text-base">
                        ৳ {Number(product.discount_price ?? 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Premium Action Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full h-9 md:h-10 rounded-full bg-white border border-[#f5ccb7] hover:bg-[#e26724] text-[#e26724] hover:text-white flex items-center justify-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-300 shadow-[0_2px_6px_rgba(243,164,123,0.06)] active:scale-[0.98]"
                    >
                      {product.product_type === "single" ? (
                        <>
                          <ShoppingCart size={14} className="shrink-0" />
                          <span>Add to Cart</span>
                        </>
                      ) : (
                        <>
                          <Eye size={14} className="shrink-0" />
                          <span>View Details</span>
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

      <CartPopup
        popup={cartPopup}
        onClose={() => setCartPopup(null)}
      />
    </>
  );
}