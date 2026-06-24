import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import CartPopup from "../CartPopup";
import { ShoppingCart, Eye, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const deal = {
  deal_title: "Best Selling Product",
  deal_offer: 20,
  products: [
    {
      product_id: 667,
      product_name: "TSC TE244 Barcode Label Printer",
      product_slug: "tsc-te244-barcode-label-printer",
      product_type: "single",
      thumb_image: "/images/image-1.jpg",
      original_price: 19500,
      discount_price: 15600,
    },
    {
      product_id: 784,
      product_name: "TSC TE344 (300dpi) Barcode Label Printer",
      product_slug: "tsc-te344-300dpi-barcode-label-printer",
      product_type: "single",
      thumb_image: "/images/image-2.jpg",
      original_price: 30000,
      discount_price: 24000,
    },
    {
      product_id: 930,
      product_name: "test pro",
      product_slug: "test-pro",
      product_type: "variable",
      thumb_image: "/images/image-3.jpg",
      original_price: 3400,
      discount_price: 2720,
    },
    {
      product_id: 932,
      product_name: "samsung s25 ultra",
      product_slug: "samsung-s25-ultra",
      product_type: "variable",
      thumb_image: "/images/image-4.jpg",
      original_price: 2300,
      discount_price: 1840,
    },
    {
      product_id: 798,
      product_name: "Rongta RP328-BU Thermal Receipt Printer (Bluetooth + USB)",
      product_slug: "rongta-rp328bu-thermal-receipt-printer-bluetooth-usb",
      product_type: "single",
      thumb_image: "/images/image-5.jpg",
      original_price: 9000,
      discount_price: 7200,
    },
    {
      product_id: 866,
      product_name: "Virdi AC-1100 Multi-Smart Card Recognition Terminal",
      product_slug: "virdi-ac1100-multismart-card-recognition-terminal",
      product_type: "single",
      thumb_image: "/images/image-6.jpg",
      original_price: 33000,
      discount_price: 26400,
    },
  ],
};

export default function BestSelling() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);

  // স্লাইডার কন্ট্রোল করার জন্য স্টেট ও রেফারেন্স
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // ১. অ্যারো বাটন ক্লিক ট্র্যাক করার জন্য নতুন স্টেট
  const [isManualMode, setIsManualMode] = useState(false);
  
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const currentTranslateX = useRef(0);

  // মোবাইল ভিউ চেকার হেল্পার
  const isMobileView = () => window.innerWidth < 768;

  // ২. মোবাইলের জন্য ম্যানুয়াল স্লাইড করার হ্যান্ডলার ফাংশন
  const handleManualSlide = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    // বাটন ক্লিক করলেই অটো স্লাইড পার্মানেন্টলি অফ করার লজিক
    if (!isManualMode) {
      setIsManualMode(true);
    }

    // রানিং অ্যানিমেশন থেকে কারেন্ট পজিশন নিখুঁতভাবে রিড করার ম্যাট্রিক্স লজিক
    const computedStyle = window.getComputedStyle(container);
    const matrix = new WebKitCSSMatrix(computedStyle.transform);
    let currentX = matrix.m41; 

    const slideAmount = 220; // প্রতি ক্লিকে মুভমেন্ট ডিসট্যান্স
    let targetX = direction === "next" ? currentX - slideAmount : currentX + slideAmount;

    // ইনফিনিট লুপ বাউন্ডারি কন্ডিশন
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

  // মাউস ড্র্যাগ এবং টাচ সোয়াইপ হ্যান্ডলার
  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    const container = sliderRef.current;
    if (!container) return;

    setIsDragging(true);
    setIsPaused(true);
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
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
        @keyframes reverseTicker {
          0% { transform: translateX(-33.3333%); }
          100% { transform: translateX(0); }
        }
        .animate-reverse-ticker {
          animation: reverseTicker 45s linear infinite;
        }
      `}</style>

      <section className="bg-white py-8 md:py-12 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
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
            className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
            // ৩. অন-হোভার কন্ডিশনে মোবাইল চেক বসানো হয়েছে যেন ফোনে অটো-স্লাইড পজ না হয়
            onMouseEnter={() => !isMobileView() && setIsPaused(true)}
            onMouseLeave={() => !isMobileView() && !isDragging && setIsPaused(false)}
          >
            {/* দুই পাশের প্রিমিয়াম ফেড ইফেক্ট শ্যাডো */}
            <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* মোবাইল নেভিগেশন অ্যারো বাটন (md:hidden ব্রেকপয়েন্ট দ্বারা ডেস্কটপে হাইড থাকবে) */}
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

                    {/* Name (এখানে নামের শুরুর টাইপো '=' চিহ্নটি রিমুভ করা হয়েছে) */}
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