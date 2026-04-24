import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMostViewedProducts } from "../../services/api";
import Loader from "../../loader/Loader";
import { normalizeProductForCart } from "../../utils/cartAdapter";
import { useDispatch } from "react-redux";
import { addItem } from "../../cart/cartSlice";
import { ShoppingCart, Eye } from "lucide-react";
import CartPopup from "../CartPopup";

const transformProducts = (apiProducts) =>
  apiProducts.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
    product_type: item.product_type,
    product_slug: item.product_slug,
    thumb_image: item.thumb_image,
    discount_price: item.discount_price,
    original_price: item.original_price,
  }));

export default function MostViewedProducts() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartPopup, setCartPopup] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiProducts = await getMostViewedProducts();
        setProducts(transformProducts(apiProducts));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (product.product_type === "variable") {
      navigate(`/product-details/${product.product_slug}`);
      return;
    }

    const normalizedProduct = normalizeProductForCart(product);
    dispatch(addItem(normalizedProduct));

    setCartPopup({
      image: product.thumb_image || product.image,
      price: product.discount_price || product.price,
    });

    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  };

  if (loading) return <Loader type="mostviewed" />;

  return (
    <>
      <section className="w-full py-10 md:py-14 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[3px] text-red-600 font-semibold mb-2">
                Trending Now
              </p>

              <h2 className="text-3xl md:text-5xl font-light text-black tracking-tight leading-none">
                Most Viewed Products
              </h2>
            </div>

            <Link
              to="/shop"
              className="text-sm md:text-base text-black font-medium underline underline-offset-4 hover:text-red-600 transition"
            >
              View All
            </Link>
          </div>

          {/* Grid Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {products.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 p-3 md:p-4"
              >
                <Link to={`/product-details/${item.product_slug}`}>
                  {/* Product Image */}
                  <div className="h-[150px] md:h-[180px] flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-3">
                    <img
                      loading="lazy"
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain transition duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="mt-4 text-[15px] md:text-[17px] font-medium leading-snug text-[#222] line-clamp-2 min-h-[62px] md:min-h-[72px] group-hover:text-black transition">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-3 flex flex-col gap-1">
                    {item?.original_price && (
                      <span className="text-[#9f9f9f] line-through text-sm">
                        ৳
                        {Number(
                          item.original_price ?? 0
                        ).toLocaleString()}
                      </span>
                    )}

                    <span className="text-black font-semibold text-lg md:text-xl">
                      ৳
                      {Number(
                        item.discount_price || item.price || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </Link>

                {/* Hover Button Desktop */}
                <div className="absolute left-3 right-3 bottom-3 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="w-full h-11 rounded-xl bg-white hover:bg-black text-black hover:text-white flex items-center justify-center gap-2 text-sm font-medium transition"
                  >
                    {item.product_type === "variable" ? (
                      <>
                        <Eye size={16} />
                        View Details
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>

                {/* Mobile Button */}
                <div className="mt-4 md:hidden">
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="w-full h-10 rounded-xl bg-black hover:bg-blue-500 text-white text-sm font-medium transition"
                  >
                    {item.product_type === "variable"
                      ? "View Details"
                      : "Add to Cart"}
                  </button>
                </div>
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