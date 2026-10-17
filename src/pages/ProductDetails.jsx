import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [cartPopup, setCartPopup] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection States
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductDetailsBySlug(slug);

        if (!res?.product?.id) throw new Error("Product not found");

        const prd = res.product;
        setProduct(prd);
        setRelatedProducts(res.related_products || []);

        // Initial default selections
        setSelectedImage(prd.thumbnail || "/images/motorola.png");

        const defaultColor = prd.colors?.[0] || null;
        const defaultSize = prd.size_chart?.[0] || null;

        setSelectedColor(defaultColor);
        setSelectedSize(defaultSize);

        // Find initial matching variant
        if (prd.variants?.length > 0) {
          const initialVariant = findMatchingVariant(
            prd.variants,
            defaultColor?.name,
            defaultSize?.size
          ) || prd.variants[0];

          setSelectedVariant(initialVariant);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Helper function to match color & size to a specific variant
  const findMatchingVariant = (variants, colorName, sizeName) => {
    if (!variants || variants.length === 0) return null;
    return variants.find(
      (v) =>
        (!colorName || v.color?.toLowerCase() === colorName?.toLowerCase()) &&
        (!sizeName || v.size?.toLowerCase() === sizeName?.toLowerCase())
    );
  };

  // Handle Color Selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (color.image) {
      setSelectedImage(color.image);
    }

    if (product?.variants) {
      const matched = findMatchingVariant(
        product.variants,
        color.name,
        selectedSize?.size
      );
      setSelectedVariant(matched || null);
    }
  };

  // Handle Size Selection
  const handleSizeSelect = (sizeObj) => {
    setSelectedSize(sizeObj);

    if (product?.variants) {
      const matched = findMatchingVariant(
        product.variants,
        selectedColor?.name,
        sizeObj.size
      );
      setSelectedVariant(matched || null);
    }
  };

  if (loading) return <Loader type="productdetails" />;

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500">
        Product not found.
      </div>
    );
  }

  // Calculated Price based on Selected Variant or Main Product Price
  const finalPrice =
    selectedVariant?.price ??
    product.price?.offer ??
    product.price?.final ??
    0;

  const regularPrice = selectedVariant?.regular_price ?? product.price?.regular;

  // Dynamic In Stock Status
  const isAvailableInStock = selectedVariant
    ? selectedVariant.in_stock && selectedVariant.quantity > 0
    : product.stock?.in_stock;

  const handleAddToCart = (quantity = 1) => {
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color!");
      return;
    }

    if (product.size_chart?.length > 0 && !selectedSize) {
      alert("Please select a size!");
      return;
    }

    if (product.variants?.length > 0 && !selectedVariant) {
      alert("Selected variation is out of stock or unavailable!");
      return;
    }

    const normalizedProduct = normalizeProductForCart(
      product,
      selectedVariant,
      selectedColor,
      quantity
    );

    dispatch(addItem(normalizedProduct));

    setCartPopup({
      image: selectedImage || product.thumbnail || "/images/motorola.png",
      price: Number(finalPrice),
    });

    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  };

  const handleBuyNow = (quantity = 1) => {
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color!");
      return;
    }

    if (product.size_chart?.length > 0 && !selectedSize) {
      alert("Please select a size!");
      return;
    }

    if (product.variants?.length > 0 && !selectedVariant) {
      alert("Selected variation is out of stock or unavailable!");
      return;
    }

    const item = normalizeProductForCart(
      product,
      selectedVariant,
      selectedColor,
      quantity
    );

    navigate("/checkout", {
      state: { item },
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen sm:py-14 px-4">
      <div className="max-w-7xl mx-auto bg-white px-4 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT SIDE - Product Image */}
          <div className="lg:col-span-4 bg-white p-4 rounded shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full border rounded-md object-cover max-h-[400px]"
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {[product.thumbnail, ...(product.gallery?.map((g) => g.url) || [])].map(
                (img, index) =>
                  img && (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 border rounded cursor-pointer object-cover ${
                        selectedImage === img
                          ? "border-orange-500"
                          : "border-gray-300"
                      }`}
                    />
                  )
              )}
            </div>
          </div>

          {/* MIDDLE - PRODUCT DETAILS */}
          <div className="lg:col-span-5 bg-white p-6 rounded shadow-sm">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                {product.name}
              </h2>

              {/* SKU */}
              {(selectedVariant?.sku || product.sku) && (
                <p className="text-gray-500 text-sm mb-1">
                  SKU: {selectedVariant?.sku || product.sku}
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
                  ⭐ {product.rating?.average || 0} ({product.rating?.total_reviews || 0} Reviews)
                </span>
              </div>

              {/* Stock Status */}
              <p className={`mb-4 font-medium ${isAvailableInStock ? "text-green-600" : "text-red-600"}`}>
                Status: {isAvailableInStock ? "In Stock" : "Out of Stock"}
                {selectedVariant && selectedVariant.quantity > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({selectedVariant.quantity} items left)
                  </span>
                )}
              </p>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h3 className="text-2xl sm:text-3xl text-orange-500 font-bold">
                  ৳ {Number(finalPrice).toLocaleString()}
                </h3>

                {Number(regularPrice) > Number(finalPrice) && (
                  <p className="line-through text-gray-400">
                    ৳ {Number(regularPrice).toLocaleString()}
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

              {/* Size Selection */}
              {product.size_chart?.length > 0 && (
                <div className="mb-6">
                  <p className="font-medium mb-2">Size:</p>
                  <div className="flex flex-wrap gap-3">
                    {product.size_chart.map((sizeObj) => {
                      const isSelected = selectedSize?.size_id === sizeObj.size_id;
                      return (
                        <button
                          key={sizeObj.size_id}
                          onClick={() => handleSizeSelect(sizeObj)}
                          className={`px-4 py-1 border rounded text-sm uppercase transition ${
                            isSelected
                              ? "border-orange-500 text-orange-500 font-bold bg-orange-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {sizeObj.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <p className="font-medium mb-2">Color:</p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor?.color_id === color.color_id;
                      return (
                        <button
                          key={color.id}
                          onClick={() => handleColorSelect(color)}
                          className={`px-4 py-2 border rounded text-sm flex items-center gap-2 transition capitalize ${
                            isSelected
                              ? "border-orange-500 text-orange-500 font-bold bg-orange-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border shadow-sm"
                            style={{ backgroundColor: color.code }}
                          ></span>
                          {color.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  disabled={!isAvailableInStock}
                  onClick={() => handleBuyNow(1)}
                  className={`w-full sm:w-auto text-white px-6 py-2 rounded transition ${
                    isAvailableInStock
                      ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Buy Now
                </button>

                <button
                  disabled={!isAvailableInStock}
                  onClick={() => handleAddToCart(1)}
                  className={`w-full sm:w-auto text-white px-6 py-2 rounded transition ${
                    isAvailableInStock
                      ? "bg-black hover:bg-gray-800 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Delivery & Seller Details */}
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
                      <span className="text-xs text-[#212121]">
                        Dhaka, Dhaka North, Banani Road No. 12 - 19
                      </span>
                      <button className="text-[10px] text-blue-500 font-bold uppercase">
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Truck className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1 flex justify-between">
                    <div>
                      <div className="text-xs text-[#212121] font-medium">
                        Standard Delivery
                      </div>
                      <div className="text-[10px] text-[#757575]">
                        Get by 27 Feb-3 Mar
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#212121]">৳ 165</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <RotateCcw className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="text-xs text-[#212121]">
                    Cash on Delivery Available
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-xs text-[#757575] mb-4">
                  Return & Warranty
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <RotateCcw className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="text-xs text-[#212121]">
                      14 days easy return
                    </div>
                  </div>
                  <div className="flex gap-3 opacity-60">
                    <ShieldAlert className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="text-xs text-[#212121]">
                      Warranty not available
                    </div>
                  </div>
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
              <div className="text-sm font-medium text-[#212121] mb-1">
                {product.brand?.name || "Official Store"}
              </div>
              <div className="text-[10px] bg-[#eff0f5] inline-block px-1 py-0.5 rounded text-gray-600 mb-4">
                Flagship Store
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4">
                <div className="text-center">
                  <div className="text-[10px] text-[#757575] uppercase leading-tight mb-1">
                    Positive Seller Ratings
                  </div>
                  <div className="text-lg font-bold text-[#212121]">90%</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-[10px] text-[#757575] uppercase leading-tight mb-1">
                    Ship on Time
                  </div>
                  <div className="text-lg font-bold text-[#212121]">100%</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-[#757575] uppercase leading-tight mb-1">
                    Chat Response Rate
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2">
                    Not enough data
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 text-[11px] font-bold text-blue-500 uppercase py-2 hover:bg-blue-50 transition-colors">
                Go to Store
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 mt-10 max-w-7xl mx-auto bg-white p-6 shadow-sm rounded-sm">
        <h4 className="font-semibold mb-2">Description:</h4>
        <div
          className="text-gray-600 leading-relaxed text-sm sm:text-base"
          dangerouslySetInnerHTML={{
            __html: product.description || "",
          }}
        />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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
                    className="md:hidden absolute bottom-1 right-1 bg-[#e62e04] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    aria-label="View Details"
                  >
                    <Eye size={16} />
                  </button>

                  <button className="hidden md:flex absolute bottom-0 left-0 right-0 bg-[#e62e04] text-white text-[10px] font-semibold py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 items-center justify-center gap-1">
                    <Eye size={16} />
                    View Details
                  </button>
                </div>

                <div className="p-1.5">
                  <p className="text-[11px] text-gray-700 leading-tight line-clamp-2 mb-1 min-h-[2.5em]">
                    {rp.name}
                  </p>

                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-[#e62e04] font-bold text-sm leading-none">
                      Tk.{Number(rp.price?.final || rp.price?.offer || 0).toLocaleString()}
                    </span>

                    {rp.price?.regular && (
                      <span className="text-gray-400 text-[10px] line-through leading-none">
                        Tk.{Number(rp.price.regular).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <CartPopup popup={cartPopup} onClose={() => setCartPopup(null)} />
    </div>
  );
}