import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { replaceCart } from "../cart/cartSlice";
import wishlistReducer, { replaceWishlist } from "../cart/wishlistSlice";

const CART_STORAGE_KEY = "cart:v1";
const WISHLIST_STORAGE_KEY = "wishlist:v1";

function loadList(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved.filter((item) => item?.product_slug) : [];
  } catch {
    return [];
  }
}

function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // storage full or blocked (private mode) - it still works for this session
  }
}

const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
    },
    preloadedState: {
        cart: { cart: loadList(CART_STORAGE_KEY), isCartOpen: false },
        wishlist: { items: loadList(WISHLIST_STORAGE_KEY) },
    },
});

// persist the cart / wishlist whenever their items change
let lastCart = store.getState().cart.cart;
let lastWishlist = store.getState().wishlist.items;
store.subscribe(() => {
  const { cart, wishlist } = store.getState();

  if (cart.cart !== lastCart) {
    lastCart = cart.cart;
    saveList(CART_STORAGE_KEY, lastCart);
  }
  if (wishlist.items !== lastWishlist) {
    lastWishlist = wishlist.items;
    saveList(WISHLIST_STORAGE_KEY, lastWishlist);
  }
});

// keep other open tabs in sync
window.addEventListener("storage", (e) => {
  if (e.key === CART_STORAGE_KEY) {
    store.dispatch(replaceCart(loadList(CART_STORAGE_KEY)));
  }
  if (e.key === WISHLIST_STORAGE_KEY) {
    store.dispatch(replaceWishlist(loadList(WISHLIST_STORAGE_KEY)));
  }
});

export default store;
