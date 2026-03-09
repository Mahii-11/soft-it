import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMostViewedProducts } from "../../services/api";
import Loader from "../../loader/Loader";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const transformProducts = (apiProducts) =>
  apiProducts.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
  }));

export default function MostViewedProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  if (loading) return <Loader type="mostviewed" />;

  const enableLoop = products.length > 5;

  return (
    <section className="w-full py-16 md:py-28 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
            Most <span className="text-[#5B3DF5]">Viewed Products</span>
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto">

          {/* Edge fade */}
          <div className="hidden md:block pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#F1F5F9] to-transparent z-10"></div>
          <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#F1F5F9] to-transparent z-10"></div>

          {/* Arrow Left */}
          <button className="mostviewed-prev hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110">
            <FiChevronLeft size={24} />
          </button>

          {/* Arrow Right */}
          <button className="mostviewed-next hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110">
            <FiChevronRight size={24} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            navigation={{
              nextEl: ".mostviewed-next",
              prevEl: ".mostviewed-prev",
            }}
            freeMode
            grabCursor
            loop={enableLoop}
            speed={550}
            spaceBetween={24}
            touchRatio={1.3}
            resistanceRatio={0.85}
            autoplay={{
              delay: 2600,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                autoplay: false,
              },
              640: {
                slidesPerView: 2,
                autoplay: false,
              },
              768: {
                slidesPerView: 3,
                autoplay: false,
              },
              1024: {
                slidesPerView: 5,
                autoplay: {
                  delay: 2600,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                },
              },
            }}
          >

            {products.map((item, index) => (
              <SwiperSlide key={`${item.id}-${index}`}>

                {/* IOS STYLE CARD */}
                <div
                  className="group bg-white rounded-2xl p-5 md:p-6 flex flex-col transition-all duration-500 -translate-y-2"
                  style={{
                    boxShadow:
                      "0 6px 16px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.06)",
                  }}
                >

                  {/* Image */}
                  <div className="h-[120px] flex items-center justify-center mb-4 overflow-hidden">

                    <img
                      loading="lazy"
                      src={item.image}
                      alt={item.name}
                      className="object-contain h-full transition-transform duration-700 group-hover:scale-110"
                    />

                  </div>

                  {/* Title */}
                  <h3 className="text-[12px] md:text-[14px] text-center text-gray-700 leading-snug line-clamp-2 min-h-[52px] font-medium">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mt-2">

                    <span className="text-blue-600 font-semibold text-[16px] md:text-[17px]">
                      Tk.{item.price?.toLocaleString()}
                    </span>

                  </div>

                  {/* Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="mt-5 rounded-full border border-blue-500 bg-blue-50 text-blue-600 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    Add to Cart
                  </button>

                </div>

              </SwiperSlide>
            ))}

          </Swiper>

        </div>

      </div>
    </section>
  );
}