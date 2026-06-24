export default function PremiumDualBanner() {
  return (
    <div className="w-full bg-[#f8f9fa] py-6 md:py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          
     
          <a 
            href="/shop/airpods" 
            className="block w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-full h-full aspect-[2.1/1] max-sm:aspect-[1.9/1]">
              <img
                src="/images/bann-1.png" 
                alt="AirPods Pro 3 Offer Banner"
                draggable={false}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 ease-out"
              />
            </div>
          </a>

          <a 
            href="/shop/apple-watch" 
            className="block w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-full h-full aspect-[2.1/1] max-sm:aspect-[1.9/1]">
              <img
                src="/images/bann.png" 
                alt="Apple Watch Series 11 Offer Banner"
                draggable={false}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 ease-out"
              />
            </div>
          </a>

        </div>

      </div>
    </div>
  );
}