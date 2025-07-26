import { createSlice } from '@reduxjs/toolkit';
import { mockOrders } from '../../data/mockData';

const initialState = {
  deliveries: mockOrders.filter(order => order.status === 'confirmed'),
  loading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateDeliveryStatus: (state, action) => {
      const { orderId, status, estimatedTime } = action.payload;
      const delivery = state.deliveries.find(d => d.id === orderId);
      if (delivery) {
        delivery.deliveryStatus = status;
        if (estimatedTime) {
          delivery.estimatedDelivery = estimatedTime;
        }
        if (status === 'delivered') {
          delivery.actualDelivery = new Date().toISOString();
        }
      }
    },
  },
});

export const { setLoading, setError, updateDeliveryStatus } = deliverySlice.actions;
export default deliverySlice.reducer;