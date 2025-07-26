import { createSlice } from '@reduxjs/toolkit';
import { mockOrders } from '../../data/mockData';

const initialState = {
  orders: mockOrders,
  filteredOrders: mockOrders,
  loading: false,
  error: null,
  statusFilter: 'all',
  dateFilter: 'all',
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        orderSlice.caseReducers.applyFilters(state);
      }
    },
    updateDeliveryStatus: (state, action) => {
      const { orderId, deliveryStatus } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.deliveryStatus = deliveryStatus;
        if (deliveryStatus === 'delivered') {
          order.actualDelivery = new Date().toISOString();
        }
        orderSlice.caseReducers.applyFilters(state);
      }
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      orderSlice.caseReducers.applyFilters(state);
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
      orderSlice.caseReducers.applyFilters(state);
    },
    applyFilters: (state) => {
      let filtered = [...state.orders];

      // Status filter
      if (state.statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === state.statusFilter);
      }

      // Date filter
      if (state.dateFilter !== 'all') {
        const now = new Date();
        const days = parseInt(state.dateFilter);
        const targetDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= targetDate;
        });
      }

      state.filteredOrders = filtered;
    },
  },
});

export const {
  setLoading,
  setError,
  updateOrderStatus,
  updateDeliveryStatus,
  setStatusFilter,
  setDateFilter,
} = orderSlice.actions;

export default orderSlice.reducer;