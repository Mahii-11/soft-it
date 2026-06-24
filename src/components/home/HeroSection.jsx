import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getOfferBanner, getSliders } from "../../services/api";
import { Link } from "wouter";
import HeroSkeleton from "../../loader/HeroSkeleton";




export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offerBanners, setOfferBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchOfferBanners = async () => {
      try {
        const res = await getOfferBanner();
        setOfferBanners(res);
      } catch (err) {
        console.error("Error fetching offer banners:", err);
      }
    }
    fetchOfferBanners();
  }, [])



useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 768); 
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);


const getImageClass = () => {
  return isMobile
    ? "w-full h-[220px] object-contain bg-white"
    : "w-full h-[420px] object-cover object-center";
};

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
      <HeroSkeleton />
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
          <section className="w-full bg-[#ffffff] py-6 md:py-20">
  <div className="max-w-7xl mx-auto px-4">

   <div className="relative w-full aspect-[21/9] overflow-hidden rounded-2xl">
  
  <motion.div
    className="flex w-full h-full"
    animate={{ x: `-${current * 100}%` }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
  >
    {slides.map((slide) => (
      <div key={slide.id} className="w-full h-full shrink-0">
        <img
          src={slide.image}
           className="
           w-full h-full
           object-cover
           object-[center_top]
          "
         />
      </div>
    ))}
  </motion.div>

</div>

  </div>
</section>
  );
}
