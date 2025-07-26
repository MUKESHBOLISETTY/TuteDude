import { configureStore } from '@reduxjs/toolkit';
import productSlice from './supplier/productSlice';
import orderSlice from './supplier/orderSlice';
import deliverySlice from './supplier/deliverySlice';
import dashboardSlice from './supplier/dashboardSlice';

export const store = configureStore({
  reducer: {
    products: productSlice,
    orders: orderSlice,
    deliveries: deliverySlice,
    dashboard: dashboardSlice,
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;