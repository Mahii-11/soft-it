import { Star } from "lucide-react";

export default function PremiumProductsSection() {
  const sections = [
    {
      title: "Featured Products",
      products: [
        { name: "Motorola Edge 60 Pro 5G", price: "40000 Tk", image: "/images/motorola.png" },
        { name: "OnePlus Buds 4 ANC TWS", price: "8450 Tk", image: "/images/oneplus.png" },
        { name: "CMF Watch Pro 2 BT", price: "6500 Tk", image: "/images/cmwatch.png" },
      ],
    },
    {
      title: "New Arrivals",
      products: [
        { name: "CMF Watch Pro 2 BT", price: "6500 Tk", image: "/images/cmwatch.png" },
        { name: "OnePlus Buds 4 ANC TWS", price: "8450 Tk", image: "/images/oneplus.png" },
        { name: "Surface Laptop 5", price: "180000 Tk", image: "/images/laptop.png" },
      ],
    },
    {
      title: "Best Selling Product",
      products: [
        { name: "Instant Pot Vortex Plus XL", price: "$59.99", image: "/images/air.png" },
        { name: "iPad Mini 6 8.3 inch", price: "$59.99", image: "/images/ipad.png" },
        { name: "JBL Live 460nc", price: "$59.99", image: "/images/jbl.png" },
      ],
    },
  ];

  return (
    <section className="w-full py-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {section.title}
              </h2>

              <div className="space-y-6">
                {section.products.map((product, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-5 bg-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      {/* Discount Badge */}
                      <span className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                        -25%
                      </span>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(4)].map((_, idx) => (
                          <Star key={idx} size={14} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        <Star size={14} className="text-gray-300 fill-gray-300" />
                        <span className="text-xs text-gray-400 ml-1">(1,234)</span>
                      </div>

                      <p className="mt-2 font-bold text-gray-900">
                        {product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
