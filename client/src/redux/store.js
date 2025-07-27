import { configureStore } from '@reduxjs/toolkit';
import productSlice from './supplier/productSlice';
import orderSlice from './supplier/orderSlice';
import deliverySlice from './supplier/deliverySlice';
import dashboardSlice from './supplier/dashboardSlice';
import authSlice from './supplier/authSlice';
import cartSlice from './supplier/cartSlice';
import voiceSearchSlice from './supplier/voiceSearchSlice';
import userProductsSlice from './supplier/userProductSlice';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    orders: orderSlice,
    deliveries: deliverySlice,
    dashboard: dashboardSlice,
    cart: cartSlice,
    userproducts : userProductsSlice,
    voice: voiceSearchSlice
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;