export function normalizeProductForCart(product) {
  if (!product) return null;

  const price =
    product.discount_price ??
    product.price?.final ??
    product.price?.offer ??
    product.price?.regular ??
    product.original_price ??
    product.price ??
    0;

  const numericPrice = Number(price) || 0;

  return {
    product_slug: product.product_slug || product.slug || "",
    product_name: product.product_name || product.name || "Unknown Product",
    image:
      product.thumb_image ||
      product.image ||
      product.thumbnail ||
      "/images/motorola.png",

    quantity: 1,
    discount_price: numericPrice,
    totalPrice: numericPrice,
  };
}