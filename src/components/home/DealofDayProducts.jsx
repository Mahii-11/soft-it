import { useEffect, useState } from "react";
import { getDealofDayProducts } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader"
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { normalizeProductForCart } from "../../utils/cartAdapter";



export default function DealofDayProducts() {
    const dispatch = useDispatch();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true)
    const navigate  = useNavigate();

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

  function handleAddToCart(e, product) {
    e.stopPropagation();

    if (product.product_type === "variable") {
      navigate(`/product-details/${product.product_slug}`);
      return;
    }
    const normalizedProduct = normalizeProductForCart(product);
    dispatch(addItem(normalizedProduct));
  }


  return (
  <section className="bg-[#F8FAFC] py-10">
     
  <div className="max-w-7xl mx-auto px-4">
    {/* Section Header */}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#0F172A]">{deal.deal_title}</h2>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
       
      {deal.products?.map((product, i) => (
        
          <div

          key={i}
          className="relative bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition duration-300 cursor-pointer group flex flex-col h-full"
        >
           <Link to={`/product-details/${product.product_slug}`} >
          {/* Discount Badge */}
          <span className="absolute top-2 left-2 bg-[#EF4444] text-white text-xs px-2 py-1 rounded-md font-medium">
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
          <h3 className="text-sm text-[#0F172A] line-clamp-2 mb-1">
            {product.product_name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2">
            <p className="text-sm sm:text-base font-semibold text-[#0F172A]">
              ৳{Number(product?.discount_price ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-[#64748B] line-through">
              ৳{Number(product?.original_price ?? 0).toLocaleString()}
            </p>
          </div>
           </Link>  

          {/* Add to Cart Button */}
          <div className="mt-auto">
            <button 
              onClick={(e) => handleAddToCart(e, product)}
              className="mt-3 w-full py-2 rounded-xl 
             bg-[#5B3DF5] 
             text-white font-medium
              text-sm sm:text-base 
             hover:bg-[#4338CA]
              transition-colors duration-300"
            
            >
                 {product.product_type === "single"
                 ? "Add to Cart"
                 : "View Details"}
            </button>
            </div>
    
         </div>
        
      ))}
      
    </div>
  </div>
  </section>
  );
}