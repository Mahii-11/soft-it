import React from "react";

export default function PremiumWatchBannerOne() {
  return (
    <div className="w-full bg-[#f8f9fa] py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <a 
          href="/shop" 
          className="block w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 group"
        >
        
          <img
            src="/images/banner-mobile.jpg" 
            alt="Watch Straps Banner - Mobile View"
            draggable={false}
            className="block md:hidden w-full h-auto object-contain select-none group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          />

          
          <img
            src="/images/banner.jpg" 
            alt="Watch Straps Banner - Stylish & Comfortable"
            draggable={false}
            className="hidden md:block w-full h-auto object-cover select-none group-hover:scale-[1.01] transition-transform duration-700 ease-out aspect-[3.8/1]"
          />
        </a>

      </div>
    </div>
  );
}