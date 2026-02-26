import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSliders } from "../../services/api";
import { Link } from "wouter";
import Loader from "../../loader/Loader";


export const offerBanners = [
  {
    id: 1,
    link: "#",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    link: "#",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
  },
];

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
        setError(null);
        const data = await getSliders({signal: controller.signal});
        setSlides(data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load sliders. Please try again later.");
          console.error("Error fetching sliders:", err)
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
    return () => controller.abort();
  }, []);


  // ✅ PRO LEVEL AUTO SLIDE
   
  useEffect(() => {
     if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };


    if (loading) {
    return (
      <Loader type="hero" />
    )
  }

  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }


  return (
    <section className="w-full bg-gray-100 py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT BIG SLIDER */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-white">
          <motion.div
            className="flex"
            animate={{ x: `-${Number(current) * 100}%` }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 20,
              mass: 1,
            }}
          >
            {slides.length > 0 &&
              slides.map((slide) => (
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
            {offerBanners.length > 0 && 
              offerBanners.map((banner) => (
                <Link key={banner.id} to={banner.link}>
                    <img
                     src={banner.image}
                     className="w-full h-[200px] object-cover"
            />
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
}
