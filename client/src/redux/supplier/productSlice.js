import { createSlice } from '@reduxjs/toolkit';
import { mockProducts } from '../../data/mockData';

const initialState = {
  products: mockProducts,
  filteredProducts: mockProducts,
  loading: false,
  error: null,
  searchTerm: '',
  categoryFilter: 'all',
  expiryFilter: 'all',
  stockFilter: 'all',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: `prod${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.products.push(newProduct);
      productSlice.caseReducers.applyFilters(state);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        productSlice.caseReducers.applyFilters(state);
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      productSlice.caseReducers.applyFilters(state);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setExpiryFilter: (state, action) => {
      state.expiryFilter = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setStockFilter: (state, action) => {
      state.stockFilter = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    applyFilters: (state) => {
      let filtered = [...state.products];

      // Search filter
      if (state.searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }

      // Category filter
      if (state.categoryFilter !== 'all') {
        filtered = filtered.filter(product => product.category === state.categoryFilter);
      }

      // Expiry filter
      if (state.expiryFilter !== 'all') {
        const now = new Date();
        const days = parseInt(state.expiryFilter);
        const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        
        filtered = filtered.filter(product => {
          const expiryDate = new Date(product.expiryDate);
          return expiryDate <= targetDate;
        });
      }

      // Stock filter
      if (state.stockFilter !== 'all') {
        if (state.stockFilter === 'low') {
          filtered = filtered.filter(product => product.stock < 20);
        } else if (state.stockFilter === 'out') {
          filtered = filtered.filter(product => product.stock === 0);
        }
      }

      state.filteredProducts = filtered;
    },
  },
});

export const {
  setLoading,
  setError,
  addProduct,
  updateProduct,
  deleteProduct,
  setSearchTerm,
  setCategoryFilter,
  setExpiryFilter,
  setStockFilter,
} = productSlice.actions;

export default productSlice.reducer;