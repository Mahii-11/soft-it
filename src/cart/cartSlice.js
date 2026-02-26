import { createSlice } from "@reduxjs/toolkit";

 
 
 


const initialState = {
  cart: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action) {
            state.cart.push(action.payload);
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
          item.totalPrice = item.quantity * item.original_price;
          }
          },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find((item) => item.product_slug === action.payload);

            if (item && item.quantity > 1) {
                 item.quantity--;
                 item.totalPrice = item.quantity * item.original_price;
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

