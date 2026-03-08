import { useEffect, useRef, useState } from "react";
import { getPremimumCategories } from "../../services/api";
import Loader from "../../loader/Loader";

export default function AutoSlidingCategories() {
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
        const data = await getPremimumCategories();
        const merged = data.map((item, index) => ({
          id: item.id,
          name: item.name,
          image: item.final_image,
          slug: item.slug,
        }));
        setCategories(merged);
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
  }, [isHovered, isMobile]);

  if (loading) {
    return <Loader type="categories" />;
  }

  return (
    <section className="w-full py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
            Popular{" "}
            <span className="text-[#5B3DF5]">
              Categories
            </span>
          </h2>
        </div>

        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex gap-8 sm:gap-12 md:gap-16 pt-6 ${
            isMobile
              ? "overflow-x-auto scroll-smooth"
              : "overflow-hidden"
          }`}
        >
          {duplicated.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="shrink-0 flex flex-col items-center group cursor-pointer"
            >
              {/* Gradient Border Circle */}
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full 
                border border-[#E2E8F0] bg-white
                transition-all duration-500
                will-change-transform
                group-hover:scale-110 group-hover:-translate-y-2`}
              >
                {/* Inner White Circle */}
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              <h3 className="mt-5 text-sm sm:text-base font-medium text-[#0F172A] text-center leading-snug line-clamp-2 h-[40px] group-hover:text-[#5B3DF5] transition-colors">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}