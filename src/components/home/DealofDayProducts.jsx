import { useEffect, useState } from "react";
import { getDealofDayProducts } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader"
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import CartPopup from "../CartPopup";



export default function DealofDayProducts() {
    const dispatch = useDispatch();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true)
    const navigate  = useNavigate();
    const [cartPopup, setCartPopup] = useState(null);

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


    setCartPopup({
    image: product.thumb_image,
    price: product.discount_price
  });

  setTimeout(() => {
    setCartPopup(null);
  }, 3000);
  }


  return (
    <>
  <section className="bg-[#F8FAFC] py-10">
     
  <div className="max-w-7xl mx-auto px-4">
    {/* Section Header */}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#0F172A]">{deal.deal_title}</h2>
    </div>

    {/* Product Grid */}
    <div className="max-w-7xl mx-auto grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-6">
      {deal.products?.map((product, i) => (
          <div
          key={i}
          className="bg-white rounded-3xl p-4 md:p-6 shadow-lg transition duration-300 cursor-pointer group flex flex-col"
           style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05)",
            }}
        >
           <Link to={`/product-details/${product.product_slug}`} >
          {/* Discount Badge */}
          <span className="absolute top-2 left-2 z-10 bg-[#EF4444] text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
            {deal.deal_offer}% OFF
          </span>

          {/* Image */}
          <div className="h-[130px] flex items-center justify-center mb-4">
            <img
              src={product.thumb_image || "/images/motorola.png"}
              alt={product.product_name}
              className="max-h-full object-contain group-hover:scale-105 transition duration-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "/images/motorola.png"; }}
            />
          </div>

          {/* Product Name */}
          <h3 className="text-[11px] md:text-[12px]  text-center text-gray-700 leading-snug line-clamp-2 min-h-10">
            {product.product_name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-blue-600 font-semibold text-[16px]">
               ৳{Number(product?.discount_price ?? 0).toLocaleString()}
            </span>

            {product?.original_price && (
                <span className="text-gray-400 text-xs line-through">
               ৳{Number(product?.original_price ?? 0).toLocaleString()}
               </span>
            )}
          </div>
           </Link>  

          {/* Add to Cart Button */}
          
            <button 
              onClick={(e) => handleAddToCart(e, product)}

              className="mt-5 rounded-full border border-blue-500 bg-blue-50 text-blue-600 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition duration-300"
               >
                 {product.product_type === "single"
                 ? "Add to Cart"
                 : "View Details"}
            </button>
        
    
         </div>
        
      ))}
      
    </div>
  </div>
  </section>


<CartPopup
  popup={cartPopup}
  onClose={() => setCartPopup(null)}
/>

</>
  );

  
}