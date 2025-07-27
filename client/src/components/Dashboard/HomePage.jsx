import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon } from '@heroicons/react/24/outline';
import ProductFilters from './Product/ProductFilters';
import ProductGrid from './Product/ProductGrid';
import FeedbackModal from './FeedbackModal';

const HomePage = () => {
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    sellerId: '',
    sellerName: ''
  });

  const sections = [
    {
      title: 'Recommended Products',
      subtitle: 'Based on your recent orders',
      action: 'View All'
    },
    {
      title: 'Top Rated Sellers',
      subtitle: 'Highly rated by other buyers',
      action: 'View All'
    },
    {
      title: 'Promoted Products',
      subtitle: 'Special offers and discounts',
      action: 'View All'
    }
  ];

  const openFeedbackModal = (sellerId, sellerName) => {
    setFeedbackModal({
      isOpen: true,
      sellerId,
      sellerName
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      sellerId: '',
      sellerName: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, Rajesh! 👋
        </h1>
        <p className="text-gray-600">
          Discover fresh products from trusted suppliers in your area
        </p>
      </motion.div>

      {/* Filters */}
      <ProductFilters />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {sections.map((section, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.subtitle}</p>
              </div>
              <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium">
                <EyeIcon className="w-4 h-4" />
                <span>{section.action}</span>
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
          
          {/* Test Feedback Button */}
          <button
            onClick={() => openFeedbackModal('fresh-farm-co', 'Fresh Farm Co.')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Rate Seller (Demo)
          </button>
        </div>
        
        <ProductGrid />
      </motion.div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={closeFeedbackModal}
        sellerId={feedbackModal.sellerId}
        sellerName={feedbackModal.sellerName}
      />
    </div>
  );
};

export default HomePage;
