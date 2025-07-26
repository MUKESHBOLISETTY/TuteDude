import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, Filter, Edit, Trash2, AlertTriangle, Package } from 'lucide-react';
import ProductModal from '../../components/supplier/ProductModal';
import {
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchTerm,
    setCategoryFilter,
    setExpiryFilter,
    setStockFilter
} from '../../redux/supplier/productSlice';
import { formatCurrency, formatDate } from '../../lib/utils';
import useProducts from '../../hooks/useProducts';

const Products = () => {
    const dispatch = useDispatch();
    const {
        filteredProducts,
        searchTerm,
        categoryFilter,
        expiryFilter,
        stockFilter
    } = useSelector(state => state.products);
    const { user, loading } = useSelector(state => state.auth)
    console.log(user, loading)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { addProduct, updateProduct, deleteProduct } = useProducts();

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (selectedProduct) {
                console.log(selectedProduct)
                await updateProduct(selectedProduct._id, productData);
            } else {
                await addProduct(productData);
            }
            // Optionally: refresh product list, close modal, etc.
        } catch (error) {
            // Error handling is already done in the hook, but you can add more here if needed
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                // Optionally: refresh product list here
                // Optionally: close modal or reset selection if needed
            } catch (error) {
                // Error handling is already done in the hook, but you can add more here if needed
            }
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
        if (stock < 20) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
        return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
    };

    const getExpiryStatus = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysToExpiry < 0) return { status: 'Expired', color: 'text-red-600 bg-red-100' };
        if (daysToExpiry <= 7) return { status: 'Expiring Soon', color: 'text-yellow-600 bg-yellow-100' };
        return { status: 'Fresh', color: 'text-green-600 bg-green-100' };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your product inventory and pricing</p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                            placeholder="Search products by name or category..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        Filters
                    </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Spices">Spices</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                                <select
                                    value={stockFilter}
                                    onChange={(e) => dispatch(setStockFilter(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">All Stock Levels</option>
                                    <option value="low">Low Stock</option>
                                    <option value="out">Out of Stock</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Status</label>
                                <select
                                    value={expiryFilter}
                                    onChange={(e) => dispatch(setExpiryFilter(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">All Products</option>
                                    <option value="7">Expiring in 7 days</option>
                                    <option value="14">Expiring in 14 days</option>
                                    <option value="30">Expiring in 30 days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {console.log(filteredProducts)}
            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    const expiryStatus = getExpiryStatus(product.expiryDate);
                    const productId = product._id.toString();
                    return (
                        <div key={productId} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-600">{product.category}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(productId)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Price</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(product.price)}/{product.unit}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Stock</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                                            {product.stock} {product.unit}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">MOQ</span>
                                        <span className="text-sm text-gray-900">
                                            {product.minOrderQty} {product.unit}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Expires</span>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${expiryStatus.color}`}>
                                                {expiryStatus.status}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(product.expiryDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
                                        <div className="pt-3 border-t border-gray-100">
                                            <span className="text-sm text-gray-600">Bulk Discounts:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {product.bulkDiscounts.map((discount, index) => (
                                                    <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                        {discount.minQty}+ → {discount.discount}% off
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all' || expiryFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Start by adding your first product'}
                    </p>
                    <button
                        onClick={handleAddProduct}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Your First Product
                    </button>
                </div>
            )}

            {/* Product Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                product={selectedProduct}
            />
        </div>

    );
};

export default Products;