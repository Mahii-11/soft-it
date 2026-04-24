
import { useEffect, useState } from "react";
import {  getOnlineSaleProducts } from "../services/api";
import {  useNavigate } from "react-router-dom";
import Loader from "../loader/Loader"
import { useDispatch } from "react-redux";
import { addItem } from "../cart/cartSlice";
import { normalizeProductForCart } from "../utils/cartAdapter";
import CartPopup from "../components/CartPopup";





export default function OnlineSale() {
  return (
    <div>
        <SaleHero />
        <OnlineSaleProducts/>
    </div>
  )
}



export function SaleHero() {
  return (
    <section className="w-full bg-[#F3F4F6] lg:bg-white  py-4 md:py-16">

      <div className="container-custom">

        <div className="lg:hidden overflow-hidden rounded-xl lg:rounded-none">

          <img
            src="/images/online-sale.png"
            alt="Sale Banner"
            className="
            w-full
            h-[120px]
            sm:h-[150px]
            md:h-[260px]
            lg:h-[320px]
            object-cover
            "
            loading="lazy"
          />

        </div>
          <div className="hidden lg:block  overflow-hidden rounded-xl lg:rounded-none">
          <img
            src="/images/sale-banner.jpg"
            alt="Sale Banner"
            className="
            w-full
            h-[120px]
            sm:h-[150px]
            md:h-[260px]
            lg:h-[320px]
            object-cover
            "
            loading="lazy"
          />

        </div>

      </div>

    </section>
  );
}






export  function OnlineSaleProducts() {
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const [cartPopup, setCartPopup] = useState(null);
    const [deal, setDeal] = useState([]);
    const [loading, setLoading] = useState(true)
   
  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        setLoading(true);
        const data = await getOnlineSaleProducts(); 
        console.log(data);
        setDeal(data);
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

  const normalizedProduct = normalizeProductForCart({
    ...product,
    id: product.product_id || product.id,
    product_id: product.product_id || product.id,
    product_name: product.name,
    discount_price: product.price,
    thumb_image: product.image,
  });

  dispatch(addItem(normalizedProduct));

  setCartPopup({
    image: product.image,
    price: product.price,
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
      <h2 className="text-2xl font-bold text-[#0F172A]"> Online Sale Products</h2>
    </div>

    {/* Product Grid */}
    <div className="max-w-7xl mx-auto grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-3">
      {deal.map((product, i) => (
          <div
          key={i}
          className="bg-white rounded-3xl p-4 md:p-6 shadow-lg transition duration-300 cursor-pointer group flex flex-col"
           style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05)",
            }}
        >
           
          {/* Image */}
          <div className="h-[130px] flex items-center justify-center mb-4">
            <img
              src={product.image || "/images/motorola.png"}
              alt={product.name}
              className="max-h-full object-contain group-hover:scale-105 transition duration-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "/images/motorola.png"; }}
            />
          </div>

          {/* Product Name */}
          <h3 className="text-[11px] md:text-[12px]  text-center text-gray-700 leading-snug line-clamp-2 min-h-10">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-blue-600 font-semibold text-[16px]">
               ৳{Number(product.price).toLocaleString()}
            </span>
          </div>
           

          {/* Add to Cart Button */}
          
            <button 
              onClick={(e) => handleAddToCart(e, product)}

              className="mt-5 rounded-full border border-blue-500 bg-blue-50 text-blue-600 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition duration-300"
               >
                {product.product_type === "variable"
                ? "View Details"
                : "Add to Cart"}
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