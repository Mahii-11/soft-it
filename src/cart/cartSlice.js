import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  isCartOpen: false,
};

// a cart line is identified by product + variation + color
const isSameItem = (a, b) =>
  a.product_slug === b.product_slug &&
  (a.variation_id || 0) === (b.variation_id || 0) &&
  (a.color_id || 0) === (b.color_id || 0);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {


       addItem(state, action) {

           const newItem = action.payload;

                const existingItem = state.cart.find(
                 (item) =>
                 item.product_slug === newItem.product_slug &&
                 (item.variation_id || 0) === (newItem.variation_id || 0) &&
                 (item.color_id || 0) === (newItem.color_id || 0)
                );

                if (existingItem) {
                existingItem.quantity += newItem.quantity ?? 1;
                existingItem.totalPrice =
                existingItem.quantity * existingItem.discount_price;
                } else {

                 state.cart.push({
                 ...newItem,
                 product_id: newItem.product_id || newItem.id,
                 quantity: newItem.quantity ?? 1,
                 totalPrice: (newItem.quantity ?? 1) * newItem.discount_price,
                 size_id: newItem.size_id || 0,
                 color_id: newItem.color_id || 0,
                 variation_id: newItem.variation_id || 0,
                 });

                }
                 state.isCartOpen = true;

               },
        



        deleteItem(state, action) {
            state.cart = state.cart.filter((item) => !isSameItem(item, action.payload));
        },
        increaseItemQuantity(state, action) {
          const item = state.cart.find((item) => isSameItem(item, action.payload));

          if (item) {
            item.quantity++;
            item.totalPrice = item.quantity * item.discount_price;
          }
        },
        decreaseItemQuantity(state, action) {
          const item = state.cart.find((item) => isSameItem(item, action.payload));

          if (item && item.quantity > 1) {
            item.quantity--;
            item.totalPrice = item.quantity * item.discount_price;
          }
        },

        clearCart(state) {
            state.cart = [];
        },
        // used to sync the cart from another browser tab
        replaceCart(state, action) {
            state.cart = action.payload;
        },
        openCart(state) {
            state.isCartOpen = true;
        },
        closeCart(state) {
            state.isCartOpen = false;
        }
    },
});

export const {addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart, replaceCart, openCart, closeCart} = cartSlice.actions;

export default cartSlice.reducer;

export const getTotalCartQuantity = (state) => (
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)
  )

export const getTotalCartPrice = (state) => (
    state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0)
  )  

export const getIsCartOpen = (state) => state.cart.isCartOpen;

export const getCart = (state) => state.cart.cart;  
