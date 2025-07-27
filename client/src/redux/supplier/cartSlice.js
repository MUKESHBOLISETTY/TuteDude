import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        existingItem.quantity = newQuantity > existingItem.maxQuantity 
          ? existingItem.maxQuantity 
          : newQuantity;
      } else {
        state.items.push(action.payload);
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0 && action.payload.quantity <= item.maxQuantity) {
        item.quantity = action.payload.quantity;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    calculateTotals: (state) => {
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;