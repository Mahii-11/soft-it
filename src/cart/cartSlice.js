import { createSlice } from "@reduxjs/toolkit";

 
 
 


const initialState = {
  cart: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        addItem(state, action) {
            const newItem = action.payload;
            

            const existingItem = state.cart.find(
                (item) => 
                    item.product_slug === newItem.product_slug &&
                    item.variation_id === newItem.variation_id &&
                    item.color_id === newItem.color_id
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice = existingItem.quantity * existingItem.discount_price;
            } else {
                state.cart.push({
                    ...newItem,
                    quantity: newItem.quantity || 1,
                    totalPrice: (newItem.quantity || 1) * newItem.discount_price,
                    product_id: newItem.product_id,
                    size_id: newItem.size_id || 0,
                    color_id: newItem.color_id || 0,
                    variation_id: newItem.variation_id || 0,
                    color_name: newItem.color_name,
                    variation_size: newItem.variation_size,
                });
            }
        },
        



        deleteItem(state, action) {
            state.cart = state.cart.filter((item) => item.product_slug !== action.payload);
        },
        increaseItemQuantity(state, action) {
          const item = state.cart.find(
          (item) => item.product_slug === action.payload
          );

          if (item) {
          item.quantity++;
          item.totalPrice = item.quantity * item.discount_price;
          }
          },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find((item) => item.product_slug === action.payload);

            if (item && item.quantity > 1) {
                 item.quantity--;
                 item.totalPrice = item.quantity * item.discount_price;
            }
           
        },

        clearCart(state) {
            state.cart = [];
        },
        
    },
});

export const {addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart} = cartSlice.actions;

export default cartSlice.reducer;

export const getTotalCartQuantity = (state) => (
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)
  )

export const getTotalCartPrice = (state) => (
    state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0)
  )  

export const getCart = (state) => state.cart.cart;  

