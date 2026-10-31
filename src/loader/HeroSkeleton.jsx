export default function HeroSkeleton() {
  return (
    <section className="w-full bg-white pt-1 md:pt-4 pb-1 md:pb-4">
      <div className="container-custom">
        <div className="relative w-full overflow-hidden rounded-[12px] md:rounded-[18px]">
          {/* Banner box, 1920x570 like the real slide */}
          <div className="relative aspect-[1920/570] w-full animate-pulse bg-white">
            {/* Brand logo */}
            <div className="absolute left-[5%] top-[10%] h-[9%] w-[12%] rounded bg-gray-200 md:h-[11%]" />

            {/* Text block + button */}
            <div className="absolute left-[12%] top-[34%] flex w-[35%] flex-col items-center gap-[4%]">
              <div className="h-2 w-[70%] rounded bg-gray-200 md:h-4" />
              <div className="mt-2 h-2 w-full rounded bg-gray-200 md:h-4" />
              <div className="mt-3 h-4 w-[55%] rounded bg-gray-300 md:mt-6 md:h-[52px]" />
            </div>

            {/* Product image */}
            <div className="absolute right-[6%] top-[12%] h-[78%] w-[34%] rounded-2xl bg-gray-200" />
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300 md:h-2 md:w-2" />
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300 md:h-2 md:w-2" />
            <div className="h-1.5 w-4 rounded-full bg-gray-400 md:h-2 md:w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
