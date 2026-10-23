import React from "react";

export default function PremiumWatchBannerOne() {
  return (
    <div className="w-full bg-[#f8f9fa] py-3 md:py-4">
      <div className="max-w-[1280px] mx-auto px-3 md:px-4">
        
        <a 
          href="/shop" 
          className="block w-full overflow-hidden rounded-xl md:rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition-all duration-300 group"
        >
        
          <img
            src="/images/banner-mobile.jpg" 
            alt="Watch Straps Banner - Mobile View"
            draggable={false}
            className="block md:hidden w-full h-auto object-cover select-none group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />

          
          <img
            src="/images/banner.jpg" 
            alt="Watch Straps Banner - Stylish & Comfortable"
            draggable={false}
            className="hidden md:block w-full object-cover select-none group-hover:scale-[1.02] transition-transform duration-500 ease-out aspect-[4.5/1]"
          />
        </a>

      </div>
    </div>
  );
}