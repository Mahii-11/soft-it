import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  const [current, setCurrent] = useState(0);

  // ✅ PRO LEVEL AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT BIG SLIDER */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-white">
          <motion.div
            className="flex"
            animate={{ x: `-${current * 100}%` }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 20,
              mass: 1,
            }}
          >
            {slides.map((slide) => (
              <img
                key={slide.id}
                src={slide.image}
                className="w-full shrink-0 h-[260px] md:h-[380px] lg:h-[420px] object-cover"
              />
            ))}
          </motion.div>

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === i ? "w-6 bg-black" : "w-2.5 bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* ARROWS */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow p-2 rounded-full"
          >
            ❮
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow p-2 rounded-full"
          >
            ❯
          </button>
        </div>

        {/* RIGHT SIDE BANNERS */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl overflow-hidden bg-white">
            <img
              src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1200&auto=format&fit=crop"
              className="w-full h-[200px] object-cover"
            />
          </div>

          <div className="rounded-xl overflow-hidden bg-white">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"
              className="w-full h-[200px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
