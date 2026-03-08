import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMostViewedProducts } from "../../services/api";
import Loader from "../../loader/Loader";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";

const transformProducts = (apiProducts) =>
  apiProducts.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
  }));

export default function MostViewedProducts() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch products
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

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const normalizedProduct = normalizeProductForCart(product);
    dispatch(addItem(normalizedProduct));
  };

  const duplicated = [...products, ...products];

  // Smooth Infinite Scroll (Desktop)
  useEffect(() => {
    if (isMobile) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const speed = 0.5;
    const animate = () => {
      if (!isHovered) {
        slider.scrollLeft += speed;
        if (slider.scrollLeft >= slider.scrollWidth / 2) slider.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isHovered, isMobile]);

  if (loading) return <Loader type="mostviewed" />;

  return (
    <section className="w-full py-16 md:py-28 bg-[#F1F5F9]">
  <div className="max-w-7xl mx-auto px-4">
    {/* Heading */}
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
        Most{" "}
        <span className="text-[#5B3DF5]">
          Viewed Products
        </span>
      </h2>
     
    </div>

    {/* Slider */}
    <div
      ref={sliderRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex gap-3 sm:gap-4 md:gap-6 pb-6 ${
        isMobile
          ? "overflow-x-auto scroll-smooth snap-x snap-mandatory"
          : "overflow-hidden"
      }`}
    >
      {duplicated.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className={`shrink-0 group cursor-pointer ${
            isMobile ? "w-1/2 snap-start" : "w-1/5"
          }`}
        >
          <div className="relative bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md rounded-2xl p-3 md:p-4  transition-all duration-500 hover:-translate-y-0.5 h-auto">
            {/* Image */}
            <div className="flex justify-center items-center mb-2 md:mb-3 h-24 md:h-28">
              <img
                src={item.image}
                alt={item.name}
                className="object-contain h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Text */}
            <div className="text-center mb-2">
              <h3 className="text-xs sm:text-sm  font-semibold text-[#0F172A] line-clamp-2 h-[40px] md:h-[44px]">
                {item.name}
              </h3>
              <p className="text-[#5B3DF5] font-bold mt-1 text-sm sm:text-base md:text-lg">
                ৳ {item.price?.toLocaleString()}
              </p>
            </div>

            {/* Compact Button */}
            <button
              onClick={(e) => handleAddToCart(e, item)}
             className="mt-2 w-full py-1.5 md:py-2 rounded-xl bg-[#5B3DF5] text-white font-medium text-xs sm:text-sm shadow-sm hover:bg-[#4338CA] transition-all duration-300 flex items-center justify-center"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}