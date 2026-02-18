import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function MostViewedProducts() {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const products = [
    { name: "iPhone 15 Pro", category: "Smartphones", image: "/images/iphone.png" },
    { name: "Sony WH-1000XM5", category: "Headphones", image: "/images/headphone.png" },
    { name: "MacBook Air M2", category: "Laptops", image: "/images/macbook.png" },
    { name: "Smart Watch X", category: "Wearables", image: "/images/watch.png" },
    { name: "Gaming Console", category: "Gaming", image: "/images/console.png" },
  ];

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
          className="flex gap-10 overflow-hidden"
        >
          {duplicated.map((item, index) => (
            <div key={index} className="shrink-0 w-64 group cursor-pointer">
              
              <div className="
                relative bg-white/70 backdrop-blur-xl 
                border border-purple-100
                rounded-3xl p-6
                shadow-lg
                overflow-hidden
                transition-all duration-500
                group-hover:-translate-y-3
                group-hover:shadow-2xl
              ">

                {/* Image */}
                <div className="flex justify-center mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Text */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-purple-500 mt-1">
                    {item.category}
                  </p>
                </div>

                {/* Add to Cart Button (Hidden by default) */}
                <div className="
                  absolute bottom-0 left-0 w-full px-6 pb-6
                  translate-y-full opacity-0
                  group-hover:translate-y-0
                  group-hover:opacity-100
                  transition-all duration-500
                ">
                  <Link to="/cart">
                   <button className="
                    w-full py-2 rounded-full
                    bg-gradient-to-r from-purple-500 to-indigo-500
                    text-white font-medium
                    shadow-md hover:shadow-lg
                    hover:scale-105
                    transition-all duration-300
                  ">
                    Add to Cart
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
