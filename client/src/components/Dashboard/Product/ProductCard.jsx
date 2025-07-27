import React,{useState} from 'react';
import { motion } from 'framer-motion';
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/supplier/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [formData,setFormData] = useState('');

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.minOrderQty,
      unit: product.unit,
      image: product.image,
      sellerId: product.seller.sellerName,
      maxQuantity: product.stock,

    }));
  };

  const getBulkDiscount = (quantity) => {
    const applicableDiscount = product.bulkDiscounts
      .filter(discount => quantity >= discount.minQty)
      .sort((a, b) => b.discount - a.discount)[0];
    
    return applicableDiscount ? applicableDiscount.discount : 0;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="w-4 h-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="w-4 h-4 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarOutlineIcon key={`outline-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const isLowStock = product.stock < product.minOrderQty * 3;
  // Calculate if expiring soon (within 7 days from now)
  const isExpiringSoon = new Date(product.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg border border-gray-100"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isPromoted && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Promoted
            </span>
          )}
          {isLowStock && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </span>
          )}
          {isExpiringSoon && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Expiring Soon
            </span>
          )}
        </div>

        {/* Bulk Discount Badge */}
        {product.bulkDiscounts.length > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              Up to {Math.max(...product.bulkDiscounts.map(d => d.discount))}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
          <span className="ml-2 text-xs text-gray-500">{product.reviews} reviews</span>
        </div>

        {/* Seller and Origin */}
        <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
          <span>by {product.seller.sellerName}</span>
          <div className="flex items-center">
            <MapPinIcon className="w-3 h-3 mr-1" />
            <span>From {product.origin}</span>
          </div>
        </div>

        {/* Price and Stock */}
        <div className="mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
            <span className="text-sm text-gray-500">per {product.unit}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>{product.stock} {product.unit} available</span>
            <span>Min Order: {product.minOrderQty} {product.unit}</span>
          </div>
        </div>

        {/* Bulk Discounts */}
        {product.bulkDiscounts.length > 0 && (
          <div className="mb-3 p-2 bg-green-50 rounded text-xs">
            <div className="font-medium text-green-800 mb-1">Bulk Discounts:</div>
            <div className="space-y-1">
              {product.bulkDiscounts.slice(0, 2).map((discount, index) => (
                <div key={index} className="text-green-700">
                  {discount.minQty}+ {product.unit}: {discount.discount}% off
                </div>
              ))}
              {product.bulkDiscounts.length > 2 && (
                <div className="text-green-600">+{product.bulkDiscounts.length - 2} more</div>
              )}
            </div>
          </div>
        )}

        {/* Quality Score */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-gray-600">Quality Score:</span>
          <span className="font-semibold text-green-600">{product.qualityScore}/5.0</span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock < product.minOrderQty}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            product.stock >= product.minOrderQty
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCartIcon className="w-4 h-4" />
          <span>
            {product.stock >= product.minOrderQty ? 'Add to Cart' : 'Out of Stock'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
