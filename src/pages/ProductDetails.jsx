import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductDetailsBySlug } from "../services/api";
import Loader from "../loader/Loader";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-4 md:p-6 rounded-md shadow-sm">

        {/* Main Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* LEFT SIDE */}
          <div className="w-full lg:w-2/5">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full border rounded-md object-cover"
            />

            <div className="flex flex-wrap gap-3 mt-4">
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

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-3/5">

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
              <span>👁 {product.views || 0} Views</span>
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
                      onClick={() =>
                        setSelectedVariation(variation)
                      }
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

            {/* Quantity */}
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
            </div>

            {/* Description */}
            <div className="mb-8">
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Buy Now
              </button>

              <Link to="/cart">
                <button className="w-full sm:w-auto bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                  Add to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

        {/* Related Products */}
           {relatedProducts.length > 0 && (
           <div className="mt-12 max-w-7xl mx-auto px-4">
           <h3 className="text-xl font-semibold mb-4">Related Products</h3>
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((rp) => (
               <Link to={`/product-details/${rp.slug}`} key={rp.id} 
                 className="bg-white p-3 rounded-md border hover:shadow-lg transition duration-300 cursor-pointer group flex flex-col">
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

                  <Link to={`/product-details/${product.product_slug}`} className="mt-auto">
                   <button 
                   className="mt-3 w-full py-1 rounded-xl
                  bg-gradient-to-r from-purple-500 to-indigo-500
                  text-white font-medium
                  text-sm sm:text-base 
                  shadow-md hover:shadow-lg
                  hover:scale-105
                  transition-all duration-300"
                 >
                  Add to Cart
                 </button>
                  </Link>
                 </Link>
                ))}
                </div>
              </div>
             )}
          </div>
         );
       }


        
