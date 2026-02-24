import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMostViewedProducts } from "../../services/api";
import Loader from "../../loader/Loader"


const transformProducts = (apiProducts) => {
  return apiProducts.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price 
  }));
};

export default function MostViewedProducts() {
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [products, setProducts] = useState([]);
  

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
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


  /* const products = [
    { name: "iPhone 15 Pro", category: "Smartphones", image: "/images/iphone.png" },
    { name: "Sony WH-1000XM5", category: "Headphones", image: "/images/headphone.png"},
    { name: "MacBook Air M2", category: "Laptops", image: "/images/macbook.png" },
    { name: "Smart Watch X", category: "Wearables", image: "/images/watch.png" },
    { name: "Gaming Console", category: "Gaming", image: "/images/console.png" },
  ]; */

  const duplicated = [...products, ...products];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        slider.scrollLeft += 1;
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
    }, 15);

    return () => clearInterval(interval);
  }, [isHovered]);

  if (loading) {
    return (
      <Loader type="mostviewed" />
    )
  }

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Most{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Viewed Products
            </span>
          </h2>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-10 overflow-hidden pb-10"
        >
             {duplicated.map((item, index) => (
               <div key={index} className="shrink-0 w-52 sm:w-64 group cursor-pointer">
               <div className="
                 relative bg-white/70 backdrop-blur-xl 
                 border border-purple-100
                 rounded-xl p-6
                 shadow-lg
                 overflow-hidden
                 transition-shadow duration-500
                 group-hover:shadow-2xl
                 sm:h-[280px]
                 h-[230px]  
                 ">
              {/* Image */}
               <div className="flex justify-center mb-4">
                <img
                src={item.image}
                alt={item.name}
                className="h-16 sm:h-24 object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

      {/* Text */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-gray-800 sm:text-base line-clamp-2">
          {item.name}
        </h3>
        <p className="text-purple-500 font-bold mt-1">
          ৳ {item.price?.toLocaleString()}
        </p>
      </div>

      {/* Add to Cart Button */}
      <div className="
        absolute bottom-4 left-1/2 -translate-x-1/2
        w-[90%]  
        transition-all duration-500
      ">
        <Link to="/productDetails">
          <button className="
            w-full py-2 rounded-xl
            bg-gradient-to-r from-purple-500 to-indigo-500
            text-white font-medium
            shadow-sm hover:shadow-md
            hover:scale-105
            transition-all duration-300
          ">
            View Category
          </button>
        </Link>
      </div>
    </div>
  </div>
))}
        </div>
      </div>
    </section>
  );
}
