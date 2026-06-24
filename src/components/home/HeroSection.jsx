import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSliders } from "../../services/api";
import HeroSkeleton from "../../loader/HeroSkeleton";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSliders = async () => {
      try {
        setLoading(true);
        const data = await getSliders({
          signal: controller.signal,
        });

        setSlides(data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load sliders");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="w-full bg-white pt-4 md:pt-14 pb-4">
      <div className="max-w-[1700px] mx-auto px-3 md:px-6">

        {/* HERO CONTAINER */}
        <div className="relative overflow-hidden rounded-[18px]">

          {/* SLIDER */}
          <motion.div
            className="flex"
            animate={{ x: `-${current * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="
                  min-w-full
                  h-[220px]
                  sm:h-[280px]
                  md:h-[380px]
                  flex
                  items-center
                  justify-center
                "
              >
                <img
                  src={slide.image}
                  alt=""
                  className="
                    w-full
                    h-full
                    object-contain
                    transition-all
                    duration-500
                  "
                />
              </div>
            ))}
          </motion.div>

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`
                  transition-all duration-300 rounded-full
                  ${
                    current === index
                      ? "w-5 h-2 bg-black"
                      : "w-2 h-2 bg-gray-400"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}