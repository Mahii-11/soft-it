

export default function WhyShopWithUs() {
  const features = [
    {
      id: 1,
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M9 12l2 2 4-4" strokeWidth="2" />
        </svg>
      ),
      title: "100% Authentic",
      subtitle: "Trusted Products",
    },
    {
      id: 2,
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeDasharray="4 2" />
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">EMI</text>
        </svg>
      ),
      title: "0% EMI Facility",
      subtitle: "Up to 12 Months",
    },
    {
      id: 3,
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l-3 3m3-3l3 3" />
        </svg>
      ),
      title: "Easy Exchange",
      subtitle: "Best Value Offer",
    },
    {
      id: 4,
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V11.25a9 9 0 00-9-9H5.625c-.621 0-1.125.504-1.125 1.125v11.25m13.06 3.31A1.125 1.125 0 0116.5 18h-1.125m-10.5-6h10.5M3.75 6.75h9.75M3.75 9.75h5.625" />
        </svg>
      ),
      title: "Fast Delivery",
      subtitle: "Nationwide Shipping",
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Heading (Image Styling Match) */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="relative inline-block font-sans tracking-tight">
            <span className="block text-2xl md:text-4xl italic font-semibold text-neutral-400 leading-none">
              Why Shop
            </span>
            <span className="block text-3xl md:text-5xl font-black text-rose-500 italic mt-1 uppercase tracking-wide">
              With Us?
            </span>
          </h2>
        </div>

        {/* Features Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0 relative">
          {features.map((item, index) => (
            <div 
              key={item.id} 
              className="relative flex flex-col items-center text-center px-4 group"
            >
              {/* Icon Container with Subtle Hover Motion */}
              <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 ease-out">
                {item.icon}
              </div>

              {/* Text Matrix */}
              <h3 className="text-sm md:text-base font-bold text-neutral-800 uppercase tracking-wider">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                {item.subtitle}
              </p>

              {/* Divider Lines (Only visible on Desktop screen) */}
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-px w-[1.5px] h-14 bg-neutral-900" />
              )}

              {/* Mobile Separator Border (Adds pro clean grid layout on phone) */}
              {index % 2 === 0 && (
                <div className="md:hidden absolute top-1/4 bottom-1/4 right-0 w-[1px] bg-neutral-100" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}