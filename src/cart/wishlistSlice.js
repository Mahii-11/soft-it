import { createSlice } from "@reduxjs/toolkit";

// a wishlist line is identified the same way as a cart line: product + variation + color
export const isSameWishlistItem = (a, b) =>
  a.product_slug === b.product_slug &&
  (a.variation_id || 0) === (b.variation_id || 0) &&
  (a.color_id || 0) === (b.color_id || 0);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    // already in the wishlist -> remove it (heart toggle), otherwise add it
    toggleWishlist(state, action) {
      const item = action.payload;
      const exists = state.items.some((x) => isSameWishlistItem(x, item));

      state.items = exists
        ? state.items.filter((x) => !isSameWishlistItem(x, item))
        : [...state.items, { ...item, product_id: item.product_id || item.id }];
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((x) => !isSameWishlistItem(x, action.payload));
    },
    clearWishlist(state) {
      state.items = [];
    },
    // used to sync the wishlist from another browser tab
    replaceWishlist(state, action) {
      state.items = action.payload;
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist, replaceWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;

export const getWishlist = (state) => state.wishlist.items;

export const selectIsInWishlist = (item) => (state) =>
  !!item && state.wishlist.items.some((x) => isSameWishlistItem(x, item));
