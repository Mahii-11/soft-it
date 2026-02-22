import { useEffect, useRef, useState } from "react";
import { getPremimumCategories } from "../../services/api";

export default function AutoSlidingCategories() {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [categories, setCategories] = useState([]);

    const staticGradients = [
    "from-purple-500 to-pink-500",
    "from-yellow-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-red-500 to-rose-500",
    "from-blue-500 to-indigo-500",
    "from-orange-500 to-amber-500",
    "from-lime-500 to-green-500",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getPremimumCategories();
        // Merge Api data with static gradients
        const merged = data.map((item, index) => ({
          id: item.id,
          name: item.name,
          image: item.final_image,
          slug: item.slug,
          gradient:
            staticGradients[index % staticGradients.length],
        }));
        setCategories(merged);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);



  const duplicated = [...categories, ...categories];

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
    <section className="w-full py-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Popular {""}<span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">Categories</span>

          </h2>
        </div>

          <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-16 overflow-hidden pt-6"
        >
          {duplicated.map((item, index) => (
            <div
              key={index}
              className="shrink-0 flex flex-col items-center group cursor-pointer"
            >
              {/* Gradient Border Circle */}
              <div
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full 
                bg-gradient-to-br ${item.gradient} 
                p-[4px]
                transition-all duration-500
                will-change-transform
                group-hover:scale-110 group-hover:-translate-y-2`}
              >
                {/* Inner White Circle */}
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              <h3 className="mt-5 text-base font-semibold text-gray-800">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
