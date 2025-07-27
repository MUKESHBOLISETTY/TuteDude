import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentListIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const OrderList = () => {
  const { orders } = useSelector((state) => state.orders);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClipboardDocumentListIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order._id} // Using _id as key as per your data structure
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.deliveryStatus)}
                  <span className="font-semibold text-gray-900">#{order.orderId}</span> {/* Using orderId as per your data structure */}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}>
                  {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">₹{order.totalprice}</div> {/* Using totalprice as per your data structure */}
                <div className="text-sm text-gray-500">{order.items.length} items</div> {/* CORRECTED LINE */}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span>Order Date: {new Date(order.createdAt).toLocaleDateString()}</span> {/* Using createdAt as per your data structure */}
              </div>
              {order.delivery && order.delivery.trackingId && ( // Check if delivery and trackingId exist
                <div>
                  <span>Tracking ID: {order.delivery.trackingId}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                View Details
              </button>
              {order.deliveryStatus === 'shipped' && ( // Check deliveryStatus for Track Order button
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Track Order
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No orders yet</div>
          <div className="text-gray-400">Start shopping to see your orders here</div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderList;