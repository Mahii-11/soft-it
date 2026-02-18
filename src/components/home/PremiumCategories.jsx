import { useEffect, useRef, useState } from "react";

export default function AutoSlidingCategories() {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const categories = [
    { name: "Electronics", image: "/images/electronics.png", gradient: "from-purple-500 to-pink-500" },
    { name: "Appliances", image: "/images/appliances.png", gradient: "from-yellow-400 to-orange-500" },
    { name: "Kitchen", image: "/images/kitchen.png", gradient: "from-emerald-400 to-teal-500" },
    { name: "Audio", image: "/images/audio.png", gradient: "from-red-500 to-rose-500" },
    { name: "Smart Home", image: "/images/smarthome.png", gradient: "from-blue-500 to-indigo-500" },
    { name: "Game", image: "/images/game.png", gradient: "from-orange-500 to-amber-500" },
    { name: "Office", image: "/images/office.png", gradient: "from-lime-500 to-green-500" },
  ];

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
          className="flex gap-12 overflow-hidden"
        >
          {duplicated.map((item, index) => (
            <div
              key={index}
              className="shrink-0 flex flex-col items-center group cursor-pointer"
            >
              {/* Gradient Border Circle */}
              <div
                className={`relative w-40 h-40 rounded-full 
                bg-gradient-to-br ${item.gradient} 
                p-[4px]
                transition-all duration-500
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
