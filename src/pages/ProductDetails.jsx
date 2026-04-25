import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductDetailsBySlug } from "../services/api";
import Loader from "../loader/Loader";

import { 
  MapPin,
  Truck,
  RotateCcw,
  ShieldAlert,
  MessageSquare,
  Eye,
} from 'lucide-react';
import { useDispatch } from "react-redux";
import { normalizeProductForCart } from "../utils/cartAdapter";
import { addItem } from "../cart/cartSlice";
import CartPopup from "../components/CartPopup";


export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [cartPopup, setCartPopup] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  

  useEffect(() => {
 const fetchProduct = async () => {
  try {
    const res = await getProductDetailsBySlug(slug);
    console.log(res);
    if (!res?.product?.id) throw new Error("Product not found");

    // API response অনুযায়ী
    setProduct(res.product);
    setSelectedImage(res.product.thumbnail || "/images/motorola.png");
    setSelectedColor(res.product.colors?.[0] || null);
    setSelectedVariation(res.product.variations?.[0] || null);
    setRelatedProducts(res.related_products || []); // ✅ related products set হচ্ছে
  } catch (error) {
    console.error("Error fetching product details:", error);
    setProduct(null);
  } finally {
    setLoading(false);
  }
};

  fetchProduct();
}, [slug]);


  if (loading) return <Loader type="productdetails" />;

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500">
        Product not found.
      </div>
    );
  }

  const finalPrice =
    selectedVariation?.price ||
    product.price?.offer ||
    product.price?.final ||
    0;

   function handleAddToCart(product, selectedVariation, selectedColor, quantity = 1) {
          if (!selectedVariation && product.variations?.length > 0) {
           alert("Please select a size!");
          return;
          }
  if (!selectedColor && product.colors?.length > 0) {
    alert("Please select a color!");
    return;
  }

         const normalizedProduct = normalizeProductForCart(
         product,
         selectedVariation,
         selectedColor,
         quantity
         );
         console.log("Selected Variation at Add:", selectedVariation);
        dispatch(addItem(normalizedProduct));
              setCartPopup({
  image:
    selectedImage ||
    product.thumbnail ||
    product.image ||
    "/images/motorola.png",

  price: Number(
    selectedVariation?.price ||
    product.discount_price ||
    product.price?.final ||
    product.price?.offer ||
    product.price?.regular ||
    0
  ),
});

              setTimeout(() => {
              setCartPopup(null);
             }, 3000);

        
      }

  return (
    <div className="bg-gray-100 min-h-screen sm:py-14 px-4">
          <div className="max-w-7xl mx-auto bg-white px-4 shadow-sm">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT SIDE Product Image */}
          <div className="lg:col-span-4 bg-white p-4 rounded shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full border rounded-md object-cover"
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {[product.thumbnail, ...(product.gallery?.map(g => g.url) || [])].map(
                (img, index) =>
                  img && (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 border rounded cursor-pointer object-cover
                      ${
                        selectedImage === img
                          ? "border-orange-500"
                          : "border-gray-300"
                      }`}
                    />
                  )
              )}
            </div>
          </div>

          {/*MIDDLE - PRODUCT DETAILS*/}
          <div className="lg:col-span-5 bg-white p-6 rounded shadow-sm">
          <div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              {product.name}
            </h2>

            {/* SKU */}
            {product.sku && (
              <p className="text-gray-500 text-sm mb-1">
                SKU: {product.sku}
              </p>
            )}

            {/* Brand */}
            <p className="text-gray-600 mb-1">
              Brand:{" "}
              <span className="text-blue-600 font-medium">
                {product.brand?.name || "No Brand"}
              </span>
            </p>

            {/* Rating + Views */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>
                ⭐ {product.rating?.average || 0} (
                {product.rating?.total_reviews || 0} Reviews)
              </span>
            </div>

            {/* Stock */}
            <p
              className={`mb-4 font-medium ${
                product.stock?.in_stock
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Status:{" "}
              {product.stock?.in_stock ? "In Stock" : "Out of Stock"}
            </p>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h3 className="text-2xl sm:text-3xl text-orange-500 font-bold">
                ৳ {Number(finalPrice).toLocaleString()}
              </h3>

              {product.price?.regular && (
                <p className="line-through text-gray-400">
                  ৳ {Number(product.price.regular).toLocaleString()}
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div
                className="text-gray-600 mb-4 text-sm"
                dangerouslySetInnerHTML={{
                  __html: product.short_description,
                }}
              />
            )}

            {/* Variations */}
            {product.variations?.length > 0 && (
              <div className="mb-6">
                <p className="font-medium mb-2">Size:</p>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => {
                        setSelectedVariation(variation);
                        console.log("Selected Variation:", variation);
                       }}
                      className={`px-4 py-1 border rounded text-sm
                      ${
                        selectedVariation?.id === variation.id
                          ? "border-orange-500 text-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {variation.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="font-medium mb-2">Color:</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                      className={`px-4 py-1 border rounded text-sm
                      ${
                        selectedColor?.id === color.id
                          ? "border-orange-500 text-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity 
            <div className="mb-6">
              <p className="font-medium mb-2">Quantity:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    quantity > 1 &&
                    setQuantity(quantity - 1)
                  }
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>

                <span className="text-lg font-medium">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div> */}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
                Buy Now
              </button>

              
                <button
                 className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                 onClick={() => handleAddToCart(product, selectedVariation, selectedColor, )}
                 
                 >
                  Add to Cart
                </button>
              
            </div>
          </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#fafafa] p-4 rounded-sm border border-gray-100">
            <div className="flex items-center justify-between text-xs text-[#757575] mb-4">
              <span>Delivery Options</span>
              <ShieldAlert className="w-4 h-4" />
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#212121]">Dhaka, Dhaka North, Banani Road No. 12 - 19</span>
                    <button className="text-[10px] text-blue-500 font-bold uppercase">Change</button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Truck className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1 flex justify-between">
                  <div>
                    <div className="text-xs text-[#212121] font-medium">Standard Delivery</div>
                    <div className="text-[10px] text-[#757575]">Get by 27 Feb-3 Mar</div>
                  </div>
                  <span className="text-xs font-bold text-[#212121]">৳ 165</span>
                </div>
              </div>

              <div className="flex gap-3">
                <RotateCcw className="w-4 h-4 text-gray-400 mt-1" />
                <div className="text-xs text-[#212121]">Cash on Delivery Available</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs text-[#757575] mb-4">Return & Warranty</div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <RotateCcw className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="text-xs text-[#212121]">14 days easy return</div>
                </div>
                <div className="flex gap-3 opacity-60">
                  <ShieldAlert className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="text-xs text-[#212121]">Warranty not available</div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-3 border border-gray-200 rounded flex gap-3 items-center">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center font-bold text-gray-400">QR</div>
              <div className="flex-1">
                 <div className="text-[10px] text-[#212121] font-bold">Download app to enjoy exclusive discounts!</div>
              </div>
            </div>
          </div>

          <div className="bg-[#fafafa] p-4 rounded-sm border border-gray-100">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-[#757575]">Sold by</span>
              <button className="text-blue-500 flex items-center gap-1 font-bold">
                <MessageSquare className="w-3 h-3" /> CHAT NOW
              </button>
            </div>
            <div className="text-sm font-medium text-[#212121] mb-1">{product.brand?.name}</div>
            <div className="text-[10px] bg-[#eff0f5] inline-block px-1 py-0.5 rounded text-gray-600 mb-4">Flagship Store</div>
            
            <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4">
              <div className="text-center">
                <div className="text-[10px] text-[#757575] uppercase leading-tight mb-1">Positive Seller Ratings</div>
                <div className="text-lg font-bold text-[#212121]">90%</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-[10px] text-[#757575] uppercase leading-tight mb-1">Ship on Time</div>
                <div className="text-lg font-bold text-[#212121]">100%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-[#757575] uppercase leading-tight mb-1">Chat Response Rate</div>
                <div className="text-[10px] text-gray-400 mt-2">Not enough data</div>
              </div>
            </div>
            
            <button className="w-full mt-4 text-[11px] font-bold text-blue-500 uppercase py-2 hover:bg-blue-50 transition-colors">
              Go to Store
            </button>
          </div>
          </div>

        </div>
       </div>

       {/* Description*/}
          

           <div className="mb-8 mt-10 max-w-7xl mx-auto bg-white p-6 shadow-sm rounded-sm">
              <h4 className="font-semibold mb-2">
                Description:
              </h4>
              <div
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                dangerouslySetInnerHTML={{
                  __html: product.description || "",
                }}
              />
            </div>
       

         

        {/* Related Products 
           {relatedProducts.length > 0 && (
           <div className="mt-12 max-w-7xl mx-auto">
           <h3 className="text-xl font-semibold mb-4">Related Products</h3>
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((rp) => (
              
               
               <div 
                 className="bg-white p-3 rounded-md border hover:shadow-lg transition duration-300 cursor-pointer group flex flex-col h-full">
                 <Link to={`/product-details/${rp.slug}`}>
                  <div className="h-28 sm:h-40 flex items-center justify-center mb-2 overflow-hidden relative">
                   <img
                   src={rp.thumbnail || "/images/motorola.png"}
                   alt={rp.name}
                   className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                   onError={(e) => { e.target.onerror = null; e.target.src = "/images/motorola.png"; }}
                   />
                  </div>
                   <h3 className="text-sm text-gray-700 line-clamp-2 mb-1">
                     {rp.name}
                   </h3>

                 <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                  ৳{Number(rp.price?.final).toLocaleString()}
                     </p>
                    <p className="text-xs text-gray-500 line-through">
                  ৳{Number(rp.price?.regular).toLocaleString()}
                    </p>
                   </div>
                 <p className={`mt-1 text-sm font-medium ${rp.stock?.in_stock ? "text-green-600" : "text-red-600"}`}>
                  {rp.stock?.in_stock ? "In Stock" : "Out of Stock"}
                 </p>
                 </Link>
                <div className="mt-auto">
                    <button 
                   onClick={() => handleAddToCart(product)}
                   className="mt-3 w-full py-1 rounded-xl
                    bg-[#5B3DF5] 
                      hover:bg-[#4338CA]
                  text-white font-medium
                  text-sm sm:text-base 
                  shadow-md hover:shadow-lg
                  hover:scale-105
                  transition-all duration-300"
                 >
                  Add to Cart
                 </button>
                </div>
                </div>
                ))}
                </div>
              </div>
             )}  */}


          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
               {relatedProducts.map((rp) => (
               <div
               key={rp.id}
               className="bg-white border border-gray-200 rounded-sm hover:shadow-md hover:scale-[1.02] transition-all duration-150 cursor-pointer overflow-hidden group"
              
            >

           <Link to={`/product-details/${rp.slug}`}>

              <div className="relative">
              <img
              src={rp.thumbnail || "/images/motorola.png"}
              alt={rp.name}
              className="w-full aspect-square object-cover"
              />

              
      
        <button
         // onClick={(e) => e.stopPropagation()}
          className="md:hidden absolute bottom-1 right-1 bg-[#e62e04] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md active:scale-90 transition-transform"
          aria-label="Add to cart"
        >
          <Eye size={16} />
        </button>
      

        {/* Desktop Hover Cart Bar */}
      
         <button
          // onClick={() => handleAddToCart(product, selectedVariation, selectedColor, )}
          className="hidden md:flex absolute bottom-0 left-0 right-0 bg-[#e62e04] text-white text-[10px] font-semibold py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 items-center justify-center gap-1"
        >
         
          <>
          <Eye size={16} />
           View Details
          </>
        </button>
             </div>

        <div className="p-1.5">
        <p className="text-[11px] text-gray-700 leading-tight line-clamp-2 mb-1 min-h-[2.5em]">
          {rp.name}
        </p>

        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-[#e62e04] font-bold text-sm leading-none">
             Tk.{Number(rp.price?.final).toLocaleString()}
          </span>

          {rp.price?.regular && (
            <span className="text-gray-400 text-[10px] line-through leading-none">
              Tk.{Number(rp.price?.regular).toLocaleString()}
            </span>
          )}
        </div>
      </div>
           </Link>
           </div>

              ))}
              </div>
              <CartPopup
                popup={cartPopup}
                onClose={() => setCartPopup(null)}
              />
          </div>
         );
       }


        
