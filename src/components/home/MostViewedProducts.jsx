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
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {duplicated.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
           className="bg-white rounded-3xl p-5 flex flex-col transition duration-300 hover:shadow-lg"
              style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05)",
            }}
        >
          
            {/* Image */}
            <div className="h-[130px] flex items-center justify-center mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="object-contain h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
              <h3 className="text-[11px] md:text-[13px]  text-center text-gray-700 leading-snug line-clamp-2 min-h-[52px]">
                {item.name}
              </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-blue-600 font-semibold text-[16px]">
                 Tk.{item.price?.toLocaleString()}
              </span>
            </div>
            {/* Compact Button */}
            <button
              onClick={(e) => handleAddToCart(e, item)}
              className="mt-5 rounded-full border border-blue-500 bg-blue-50 text-blue-600 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition"
            >
              Add to Cart
            </button>
          </div>
        
      ))}
      </div>
    </div>
  </div>
</section>
  );
}