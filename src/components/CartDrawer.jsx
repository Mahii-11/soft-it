import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  closeCart,
  decreaseItemQuantity,
  deleteItem,
  getCart,
  getIsCartOpen,
  getTotalCartPrice,
  getTotalCartQuantity,
  increaseItemQuantity,
} from "../cart/cartSlice";

const FALLBACK_IMAGE = "/images/motorola.png";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(getIsCartOpen);
  const items = useSelector(getCart);
  const subtotal = useSelector(getTotalCartPrice);
  const totalQuantity = useSelector(getTotalCartQuantity);

  const close = () => dispatch(closeCart());

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => e.key === "Escape" && dispatch(closeCart());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, dispatch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white font-sans shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#26282d] px-5 py-4 text-white">
              <h2 className="flex items-center gap-2 font-sans text-base font-bold">
                <ShoppingBag size={18} />
                Shopping Cart
                <span className="rounded-full bg-[#ea5b3a] px-2 py-0.5 text-[11px] font-semibold">
                  {totalQuantity}
                </span>
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="rounded-full p-1.5 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f6f6f6] text-neutral-400">
                  <ShoppingBag size={32} />
                </span>
                <h3 className="font-sans text-lg font-bold text-neutral-900">Your cart is empty</h3>
                <p className="max-w-[260px] text-sm text-neutral-500">
                  Looks like you haven&apos;t added anything to your cart yet.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 rounded-md bg-[#26282d] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
                  {items.map((item) => (
                    <li
                      key={`${item.product_slug}-${item.variation_id}-${item.color_id}`}
                      className="flex gap-4 py-4"
                    >
                      <Link
                        to={`/product-details/${item.product_slug}`}
                        onClick={close}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f6f6f6]"
                      >
                        <img
                          src={item.image || FALLBACK_IMAGE}
                          alt={item.product_name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product-details/${item.product_slug}`}
                            onClick={close}
                            className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 hover:text-[#ea5b3a]"
                          >
                            {item.product_name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => dispatch(deleteItem(item))}
                            aria-label="Remove item"
                            className="shrink-0 text-neutral-400 transition hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {(item.variation_size || item.color_name) && (
                          <p className="mt-1 text-xs capitalize text-neutral-500">
                            {[item.variation_size && `Size: ${item.variation_size}`, item.color_name && `Color: ${item.color_name}`]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center overflow-hidden rounded-md border border-neutral-200">
                            <button
                              type="button"
                              onClick={() => dispatch(decreaseItemQuantity(item))}
                              aria-label="Decrease quantity"
                              className="p-1.5 transition hover:bg-neutral-100"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => dispatch(increaseItemQuantity(item))}
                              aria-label="Increase quantity"
                              className="p-1.5 transition hover:bg-neutral-100"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="font-sans text-sm font-bold text-neutral-900">
                            ৳{Number(item.totalPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="border-t border-neutral-100 bg-[#fafafa] px-5 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Subtotal</span>
                    <span className="font-sans text-xl font-bold text-neutral-900">
                      ৳{Number(subtotal).toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={close}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#ea5b3a] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d44a2a]"
                  >
                    Checkout <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-2 h-11 w-full rounded-md border border-neutral-300 text-sm font-semibold text-neutral-700 transition hover:bg-white"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
