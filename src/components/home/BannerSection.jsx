const bannerData = [
  {
    id: 1,
    category: "BIG SAVING",
    title: "Galaxy S23 Lite Love The Price.",
    price: "From $429.00",
    image: "/images/samsung.png",
    bgColor: "bg-[#F9FAFB]", // soft neutral gray
    buttonText: "Buy Now",
    isLink: false
  },
  {
    id: 2,
    category: "10% OFF",
    title: "Smartwatch 7 Light On Price.",
    price: "From $199.00",
    image: "/images/applewatch.png",
    bgColor: "bg-[#EFF6FF]", // soft light blue
    buttonText: "Learn More",
    isLink: true
  },
  {
    id: 3,
    category: "SMART HOME",
    title: "Five Bold Colors. $99 Each.",
    price: "From $229.00",
    image: "/images/smarthome.png",
    bgColor: "bg-[#F3F4F6]", // soft gray
    buttonText: "Buy Now",
    isLink: false
  },
  {
    id: 4,
    category: "BEST PRICE",
    title: "5th Generation AirPods.",
    price: "From $499.00",
    image: "/images/oneplus.png",
    bgColor: "bg-[#F9FAFB]", // neutral gray
    buttonText: "Learn More",
    isLink: true
  },
  {
    id: 5,
    category: "FLAT 25% OFF",
    title: "Headset Max 3rd Generation.",
    price: "From $549.00",
    image: "/images/headphone.png",
    bgColor: "bg-[#EFF6FF]", // light blue
    buttonText: "Buy Now",
    isLink: false
  },
  {
    id: 6,
    category: "NEWLY ADDED",
    title: "Mac Book Pro. New Arrival",
    price: "From $2499",
    image: "/images/macbook.png",
    bgColor: "bg-[#F3F4F6]", // soft gray
    buttonText: "Learn More",
    isLink: true
  }
];



export default function BannerSection() {
  return (
    <div className="min-h-screen bg-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bannerData.map((item) => (
            <div
              key={item.id}
              className={`${item.bgColor} rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden h-[280px] group shadow-md hover:shadow-xl transition-shadow hover:-translate-y-1`}
            >
              <div className="relative z-10 max-w-[60%]">
                <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm font-bold text-blue-600 mt-2">
                  {item.price}
                </p>

                <div className="mt-6">
                  {item.isLink ? (
                    <button className="px-6 py-2.5 rounded-full border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-colors">
                      {item.buttonText}
                    </button>
                  ) : (
                    <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors">
                      {item.buttonText}
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute right-[-10px] bottom-[-10px] w-[55%] h-[80%] flex items-center justify-center p-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}