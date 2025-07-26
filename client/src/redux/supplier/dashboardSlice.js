import { createSlice } from '@reduxjs/toolkit';
import { dashboardStats } from '../../data/mockData';

const initialState = {
  stats: dashboardStats,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
});

export const { setLoading, setStats, setError, updateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;