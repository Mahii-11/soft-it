import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getOfferBanner, getSliders } from "../../services/api";
import { Link } from "wouter";
import Loader from "../../loader/Loader";




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
    setIsMobile(window.innerWidth < 768); // md breakpoint
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
    <section className="w-full bg-#FFFFFF md:py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4">
        {/* LEFT BIG SLIDER */}
             <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-white">

  <motion.div
    className="flex"
    animate={{ x: `-${Number(current) * 100}%` }}
    transition={{
      type: "spring",
      stiffness: 60,
      damping: 20,
    }}
  >
    {slides.map((slide) => (
      <div key={slide.id} className="w-full shrink-0">
        <img
          src={slide.image}
          className={getImageClass()}
        />
      </div>
    ))}
  </motion.div>
   </div>


        {/* RIGHT SIDE BANNERS */}
        <div className="flex flex-col gap-2 sm:gap-4">
             {offerBanners.length > 0 && 
             offerBanners.map((banner) => (
             <Link key={banner.id} to={banner.link} className="rounded-xl overflow-hidden bg-white">
            <img
            src={banner.image}
            className="w-full h-[200px] object-cover"
            />
           </Link>
            ))
           }
        </div> 
      </div>
    </section>
  );
}
