import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getSliders } from "../../services/api";
import HeroSkeleton from "../../loader/HeroSkeleton";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSliders = async () => {
      try {
        setLoading(true);
        const data = await getSliders({ signal: controller.signal });
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
    if (slides.length < 2) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  const goNext = () => setCurrent((p) => (p + 1) % slides.length);
  const goPrev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current > 50) goPrev();
    else if (touchDeltaX.current < -50) goNext();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[140px] md:min-h-[320px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!slides.length) return null;

  return (
    <section className="w-full bg-white pt-1 md:pt-14 pb-1 md:pb-4">
      <div className="container-custom">
        {/* HERO CONTAINER */}
        <div
          className="relative w-full overflow-hidden rounded-[12px] md:rounded-[18px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* SLIDER TRACK */}
          <motion.div
            className="flex w-full"
            animate={{ x: `-${current * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id ?? index}
                className="w-full shrink-0 grow-0 basis-full"
              >
                <picture>
                  {slide.mobileImage && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={slide.mobileImage}
                    />
                  )}
                  <img
                    src={slide.image}
                    alt={slide.title || ""}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    draggable="false"
                    className="block w-full h-auto select-none"
                  />
                </picture>
              </div>
            ))}
          </motion.div>

          {/* DOTS */}
          {slides.length > 1 && (
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setCurrent(index)}
                  className={`transition-all duration-300 rounded-full ${
                    current === index
                      ? "w-4 h-1.5 md:w-5 md:h-2 bg-black"
                      : "w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}