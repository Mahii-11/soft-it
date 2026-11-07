import { Heart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../../cart/wishlistSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector(getWishlist);


  return (
    <>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Wishlist</h1>
        <p className="text-slate-500 mt-1">{wishlistItems.length} items saved for later.</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Heart className="w-9 h-9 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-sm text-slate-500 mt-1">Save products you like and find them here later.</p>
          <Link
            to="/"
            className="mt-5 px-6 py-2.5 rounded-lg bg-[#ea5b3a] text-white text-sm font-semibold hover:bg-[#d44a2a] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const key = `${item.product_slug}-${item.variation_id || 0}-${item.color_id || 0}`;
            const variant = [item.variation_size, item.color_name].filter(Boolean).join(" · ");

            return (
              <div
                key={key}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/product-details/${item.product_slug}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/product-details/${item.product_slug}`)}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
              >
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.product_name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-slate-900 line-clamp-2">{item.product_name}</h3>
                  {variant && <p className="mt-1 text-xs text-slate-500">{variant}</p>}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <p className="text-lg font-bold text-slate-900">
                      ৳{Number(item.discount_price || 0).toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeFromWishlist(item));
                      }}
                      aria-label="Remove from wishlist"
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
