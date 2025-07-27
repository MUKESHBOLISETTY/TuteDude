import { createSlice } from '@reduxjs/toolkit';

const mockProducts = [
    {
        id: '1',
        name: 'Potatoes (A-grade)',
        category: 'Vegetables',
        unit: 'kg',
        price: 25,
        stock: 500,
        minOrderQty: 10,
        qualityScore: 4.8,
        expiryDate: '2025-02-15',
        isExpired: false,
        bulkDiscounts: [
            { minQty: 20, discount: 5 },
            { minQty: 50, discount: 10 },
            { minQty: 100, discount: 15 }
        ],
        origin: 'Karnataka',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-20',
        image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Fresh Farm Co.',
        isPromoted: true,
        rating: 4.3,
        reviews: 156
    },
    {
        id: '2',
        name: 'Fresh Tomatoes (Premium)',
        category: 'Vegetables',
        unit: 'kg',
        price: 45,
        stock: 200,
        minOrderQty: 5,
        qualityScore: 4.7,
        expiryDate: '2025-01-25',
        isExpired: false,
        bulkDiscounts: [
            { minQty: 10, discount: 8 },
            { minQty: 25, discount: 15 }
        ],
        origin: 'Maharashtra',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-20',
        image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Fresh Farm Co.',
        rating: 4.7,
        reviews: 89
    },
    {
        id: '3',
        name: 'Premium Milk (Full Cream)',
        category: 'Dairy',
        unit: 'liter',
        price: 65,
        stock: 100,
        minOrderQty: 2,
        qualityScore: 4.9,
        expiryDate: '2025-01-28',
        isExpired: false,
        bulkDiscounts: [
            { minQty: 5, discount: 5 },
            { minQty: 10, discount: 12 }
        ],
        origin: 'Punjab',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-20',
        image: 'https://images.pexels.com/photos/416755/pexels-photo-416755.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Dairy Fresh Ltd.',
        isPromoted: true,
        rating: 4.9,
        reviews: 234
    },
    {
        id: '4',
        name: 'Organic Turmeric Powder',
        category: 'Spices',
        unit: 'kg',
        price: 120,
        stock: 75,
        minOrderQty: 1,
        qualityScore: 4.8,
        expiryDate: '2025-12-31',
        isExpired: false,
        bulkDiscounts: [
            { minQty: 3, discount: 10 },
            { minQty: 5, discount: 18 }
        ],
        origin: 'Kerala',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-20',
        image: 'https://images.pexels.com/photos/4198655/pexels-photo-4198655.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Spice Masters',
        rating: 4.8,
        reviews: 67
    },
    {
        id: '5',
        name: 'Fresh Onions (Red)',
        category: 'Vegetables',
        unit: 'kg',
        price: 30,
        stock: 300,
        minOrderQty: 5,
        qualityScore: 4.5,
        expiryDate: '2025-02-10',
        isExpired: false,
        bulkDiscounts: [
            { minQty: 10, discount: 7 },
            { minQty: 25, discount: 12 }
        ],
        origin: 'Maharashtra',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-20',
        image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Fresh Farm Co.',
        rating: 4.5,
        reviews: 123
    },
    {
        id: '6',
        name: 'Paneer (Fresh)',
        category: 'Dairy',
        unit: 'kg',
        price: 280,
        stock: 50,
        minOrderQty: 1,
        qualityScore: 4.9,
        expiryDate: '2025-01-24',
        isExpired: false,
        bulkDiscounts: [
            { minQty: 2, discount: 5 },
            { minQty: 5, discount: 10 }
        ],
        origin: 'Punjab',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-20',
        image: 'https://images.pexels.com/photos/8844095/pexels-photo-8844095.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Dairy Fresh Ltd.',
        rating: 4.9,
        reviews: 45
    }
];

const initialState = {
    userProducts: mockProducts,
    filteredUserProducts: mockProducts,
    filters: {
        category: 'All Products',
        sortBy: 'rating',
        searchQuery: '',
    },
    loading: false,
};

const userProductsSlice = createSlice({
    name: 'userproducts',
    initialState,
    reducers: {
        setUserProducts: (state, action) => {
            state.userProducts = action.payload;
            state.filteredUserProducts = action.payload;
        },
        setFilter: (state, action) => {
            console.log("Setting filter:", action.payload);
            state.filters[action.payload.key] = action.payload.value;
            userProductsSlice.caseReducers.applyUserFilters(state);
        },
        setSearchQuery: (state, action) => {
            state.filters.searchQuery = action.payload;
            userProductsSlice.caseReducers.applyUserFilters(state);
        },
        applyUserFilters: (state) => {
            let filtered = [...state.userProducts];

            // Apply category filter
            if (state.filters.category !== 'All Products') {
                filtered = filtered.filter(product => product.category === state.filters.category);
            }

            // Apply search filter
            if (state.filters.searchQuery) {
                const query = state.filters.searchQuery.toLowerCase();
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query) ||
                    product.seller.toLowerCase().includes(query)
                );
            }

            // Apply sorting
            switch (state.filters.sortBy) {
                case 'price-low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case 'name':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    break;
            }

            state.filteredUserProducts = filtered;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setUserProducts, setFilter, setSearchQuery, applyUserFilters, setLoading } = userProductsSlice.actions;
export default userProductsSlice.reducer;