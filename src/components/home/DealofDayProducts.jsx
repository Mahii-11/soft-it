import { useEffect, useState } from "react";
import { getDealofDayProducts } from "../../services/api";
import { Link } from "react-router-dom";
import Loader from "../../loader/Loader"


export default function DealofDayProducts() {
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        const data = await getDealofDayProducts(); // returns array
        setDeal(data[0] || null); // pick first deal
      } catch (error) {
        console.error("Error fetching deal products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDealProducts();
  }, []);

  if (loading) {
    return (
      <Loader type="dealofday" count={5} />
    )
  }

  if (!deal) {
    return (
      <div className="text-center py-20 text-gray-500">
        No deals available.
      </div>
    );
  }


  return (
    <section className="bg-[#f3f3f3] py-10">
  <div className="max-w-7xl mx-auto px-4">
    {/* Section Header */}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{deal.deal_title}</h2>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {deal.products?.map((product, i) => (
        <div
          key={i}
          className="bg-white p-3 rounded-md border hover:shadow-lg transition duration-300 cursor-pointer group flex flex-col"
        >
          {/* Discount Badge */}
          <span className="absolute bg-red-600 text-white text-xs px-2 py-1 rounded-sm z-10">
            {deal.deal_offer}% OFF
          </span>

          {/* Image */}
          <div className="h-28 sm:h-40 flex items-center justify-center mb-2 overflow-hidden relative">
            <img
              src={product.thumb_image || "/images/motorola.png"}
              alt={product.product_name}
              className="max-h-full object-contain group-hover:scale-105 transition duration-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "/images/motorola.png"; }}
            />
          </div>

          {/* Product Name */}
          <h3 className="text-sm text-gray-700 line-clamp-2 mb-1">
            {product.product_name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2">
            <p className="text-sm sm:text-base font-semibold text-gray-900">
              ৳{Number(product?.discount_price ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 line-through">
              ৳{Number(product?.orginal_price ?? 0).toLocaleString()}
            </p>
          </div>

          {/* Add to Cart Button */}
          <Link to={`/product/${product.product_slug}`} className="mt-auto">
            <button 
              className="mt-3 w-full py-1 rounded-xl
                  bg-gradient-to-r from-purple-500 to-indigo-500
                  text-white font-medium
                  text-sm sm:text-base 
                  shadow-md hover:shadow-lg
                  hover:scale-105
                  transition-all duration-300"
            >
              View Category
            </button>
          </Link>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}