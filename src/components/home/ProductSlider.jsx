import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import ProductCard from "../ProductCard";

const DEFAULT_BREAKPOINTS = {
  320: { slidesPerView: 2.1, spaceBetween: 10 },
  640: { slidesPerView: 3.2, spaceBetween: 12 },
  768: { slidesPerView: 4, spaceBetween: 12 },
  1024: { slidesPerView: 5, spaceBetween: 12 },
};

const arrowClass =
  "absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-500/80 text-white shadow transition hover:bg-neutral-700 md:flex";

export function ProductSliderSkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-md bg-white shadow-sm">
          <div className="aspect-square bg-neutral-200" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 rounded bg-neutral-200" />
            <div className="h-4 w-1/3 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductSlider({ products, breakpoints = DEFAULT_BREAKPOINTS }) {
  const [swiper, setSwiper] = useState(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const sync = (s) => setEdges({ start: s.isBeginning, end: s.isEnd });

  return (
    <div className="relative">
      {!edges.start && (
        <button
          type="button"
          aria-label="Previous"
          onClick={() => swiper?.slidePrev()}
          className={`${arrowClass} -left-4`}
        >
          <ChevronLeft size={16} />
        </button>
      )}
      {!edges.end && (
        <button
          type="button"
          aria-label="Next"
          onClick={() => swiper?.slideNext()}
          className={`${arrowClass} -right-4`}
        >
          <ChevronRight size={16} />
        </button>
      )}

      <Swiper
        modules={[Navigation, A11y]}
        speed={500}
        watchOverflow
        grabCursor
        breakpoints={breakpoints}
        onSwiper={(s) => {
          setSwiper(s);
          sync(s);
        }}
        onSlideChange={sync}
        onResize={sync}
        className="!pb-2 !pt-1"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="!h-auto">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
