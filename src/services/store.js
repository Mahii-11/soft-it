import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { replaceCart } from "../cart/cartSlice";

const CART_STORAGE_KEY = "cart:v1";

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((item) => item?.product_slug) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // storage full or blocked (private mode) - the cart still works for this session
  }
}

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    preloadedState: {
        cart: { cart: loadCart(), isCartOpen: false },
    },
});

// persist the cart whenever its items change
let lastCart = store.getState().cart.cart;
store.subscribe(() => {
  const cart = store.getState().cart.cart;
  if (cart !== lastCart) {
    lastCart = cart;
    saveCart(cart);
  }
});

// keep other open tabs in sync
window.addEventListener("storage", (e) => {
  if (e.key === CART_STORAGE_KEY) {
    store.dispatch(replaceCart(loadCart()));
  }
});

export default store;
