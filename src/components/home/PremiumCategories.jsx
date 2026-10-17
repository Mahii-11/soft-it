import { useEffect, useRef, useState } from "react";
import { getPremimumCategories } from "../../services/api";
import Loader from "../../loader/Loader";

export default function PremiumCategories() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // getPremimumCategories returns the featured-category-data array
        const data = await getPremimumCategories();

        if (Array.isArray(data)) {
          const merged = data
            .slice()
            .sort((a, b) => a.serial - b.serial)
            .map((item) => ({
              id: item.id,
              name: item.name || "Category",
              // Fallback placeholder image if image is null
              image: item.image || "https://via.placeholder.com/150?text=Category",
              slug: item.slug || "",
            }));

          setCategories(merged);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const duplicated = [...categories, ...categories];

  // Smooth Infinite Auto Scroll (Desktop Only)
  useEffect(() => {
    if (isMobile) return; // Disable auto scroll on mobile

    const slider = sliderRef.current;
    if (!slider) return;

    const scrollSpeed = 0.5; // smooth slow speed

    const animate = () => {
      if (!isHovered) {
        slider.scrollLeft += scrollSpeed;

        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, isMobile, categories]);

  if (loading) {
    return <Loader type="categories" />;
  }

  // Categories list empty hole UI te section hide rakhbe
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 md:py-6 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-3 md:px-5">
        <div className="text-center mb-3 md:mb-5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A]">
            Popular <span className="text-red-600">Categories</span>
          </h2>
        </div>

        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex gap-5 sm:gap-7 md:gap-10 pt-2 ${
            isMobile ? "overflow-x-auto scroll-smooth" : "overflow-hidden"
          }`}
        >
          {duplicated.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="shrink-0 flex flex-col items-center group cursor-pointer px-1"
            >
              {/* Gradient Border Circle */}
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full 
                border border-[#E2E8F0] bg-white
                transition-all duration-500
                will-change-transform
                group-hover:scale-105 group-hover:-translate-y-1`}
              >
                {/* Inner White Circle */}
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      // Safety check if image link fails to load from server
                      e.currentTarget.src =
                        "https://via.placeholder.com/150?text=Category";
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <h3 className="mt-3 text-[11px] sm:text-xs md:text-sm font-medium text-[#0F172A] text-center leading-tight line-clamp-2 h-[34px] group-hover:text-[#d60000] transition-colors">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}