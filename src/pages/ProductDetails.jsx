import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetailsBySlug } from "../services/api";
import Loader from "../loader/Loader";

import { useDispatch } from "react-redux";
import { normalizeProductForCart } from "../utils/cartAdapter";
import { addItem } from "../cart/cartSlice";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();

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

  const discountPercent =
    Number(regularPrice) > Number(finalPrice)
      ? Math.round(((Number(regularPrice) - Number(finalPrice)) / Number(regularPrice)) * 100)
      : 0;
  const reviewCount = product.rating?.total_reviews || 0;
  const gallery = [product.thumbnail, ...(product.gallery?.map((g) => g.url) || [])].filter(Boolean);

  const optionClass = (selected) =>
    `rounded-md border px-4 py-2 text-sm font-medium uppercase transition ${
      selected
        ? "border-[#ea5b3a] bg-[#ea5b3a]/10 text-[#ea5b3a]"
        : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
    }`;

  const primaryButton = (enabled, color) =>
    `h-12 flex-1 rounded-md text-sm font-bold uppercase tracking-wide text-white transition ${
      enabled ? color : "cursor-not-allowed bg-neutral-300"
    }`;

  return (
    <div className="min-h-screen bg-[#f0f0f0] px-3 py-4 font-sans sm:py-8 md:px-5">
      <div className="mx-auto max-w-[1400px] rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">

          {/* LEFT - Gallery */}
          <div className="lg:col-span-5">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f6f6f6]">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {gallery.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 overflow-hidden rounded-lg bg-[#f6f6f6] ring-2 transition sm:h-20 sm:w-20 ${
                      selectedImage === img ? "ring-[#ea5b3a]" : "ring-transparent hover:ring-neutral-300"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - Details */}
          <div className="lg:col-span-7">
            {product.brand?.name && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ea5b3a]">
                {product.brand.name}
              </p>
            )}

            <h1 className="font-sans text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
              {(selectedVariant?.sku || product.sku) && (
                <span>SKU: {selectedVariant?.sku || product.sku}</span>
              )}
              {reviewCount > 0 && (
                <span>
                  ★ {product.rating?.average || 0} ({reviewCount} Reviews)
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isAvailableInStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAvailableInStock ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {isAvailableInStock ? "In Stock" : "Out of Stock"}
                {selectedVariant && selectedVariant.quantity > 0 && (
                  <span className="font-normal opacity-80">· {selectedVariant.quantity} left</span>
                )}
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-neutral-100 py-5">
              <span className="font-sans text-3xl font-bold text-neutral-900 sm:text-4xl">
                ৳{Number(finalPrice).toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-lg text-neutral-400 line-through">
                    ৳{Number(regularPrice).toLocaleString()}
                  </span>
                  <span className="rounded bg-[#ea5b3a] px-2 py-0.5 text-xs font-bold text-white">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div
                className="mt-5 text-sm leading-relaxed text-neutral-600"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Size Selection */}
            {product.size_chart?.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-neutral-900">
                  Size
                  {selectedSize && (
                    <span className="ml-2 font-normal uppercase text-neutral-500">
                      {selectedSize.size}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.size_chart.map((sizeObj) => (
                    <button
                      key={sizeObj.size_id}
                      type="button"
                      onClick={() => handleSizeSelect(sizeObj)}
                      className={`min-w-[52px] ${optionClass(
                        selectedSize?.size_id === sizeObj.size_id
                      )}`}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-neutral-900">
                  Color
                  {selectedColor && (
                    <span className="ml-2 font-normal capitalize text-neutral-500">
                      {selectedColor.name}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`flex items-center gap-2 capitalize ${optionClass(
                        selectedColor?.color_id === color.color_id
                      )}`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: color.code }}
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                disabled={!isAvailableInStock}
                onClick={() => handleBuyNow(1)}
                className={primaryButton(isAvailableInStock, "bg-[#ea5b3a] hover:bg-[#d44a2a]")}
              >
                Buy Now
              </button>

              <button
                disabled={!isAvailableInStock}
                onClick={() => handleAddToCart(1)}
                className={primaryButton(isAvailableInStock, "bg-[#26282d] hover:bg-black")}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mx-auto mt-6 max-w-[1400px] rounded-xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:p-8">
          <h2 className="mb-4 flex items-center gap-3 font-sans text-lg font-bold text-neutral-900">
            <span className="h-5 w-1 rounded bg-[#ea5b3a]" />
            Product Description
          </h2>
          <div
            className="text-sm leading-relaxed text-neutral-600 sm:text-base"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mx-auto mt-8 max-w-[1400px] pb-4">
          <h2 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}