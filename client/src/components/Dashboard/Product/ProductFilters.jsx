import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// RootState import is removed as it's TypeScript specific
import { setFilter } from '../../store/slices/productsSlice';
import { FunnelIcon } from '@heroicons/react/24/outline';

const categories = ['All Products', 'Vegetables', 'Dairy', 'Spices'];
const sortOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const ProductFilters = () => {
  const dispatch = useDispatch();
  // Type annotation for useSelector state is removed for JSX conversion
  const { filters } = useSelector((state) => state.products);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Filter By */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => dispatch(setFilter({ key: 'category', value: category }))}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.category === category
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => dispatch(setFilter({ key: 'sortBy', value: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
