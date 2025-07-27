import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentListIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { Eye, Filter, Download, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { formatCurrency, formatDateTime, getOrderStatusColor, getDeliveryStatusColor } from '../../lib/utils';

const OrderList = () => {
  const { userorders } = useSelector((state) => state.orders);
  const [selectedOrder,setSelectedOrder] = useState(null);

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
        {userorders.map((order) => (
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
          
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button 
              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => setSelectedOrder(order)}>
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {userorders.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No orders yet</div>
          <div className="text-gray-400">Start shopping to see your orders here</div>
        </div>
      )}

       {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
      
                  <div className="p-6 space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Order ID</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.orderId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Order Date</label>
                        <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedOrder.delivery.deliveredOn)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Delivery Status</label>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getDeliveryStatusColor(selectedOrder.deliveryStatus)}`}>
                          {selectedOrder.deliveryStatus}
                        </span>
                      </div>
                    </div>
      
                    {/* Vendor Info */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.customer.customerName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.customer.customerEmail}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedOrder.delivery.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
      
                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} {item.unit} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{formatCurrency(item.quantity * item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
      
                      {/* Order Summary */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">{formatCurrency(selectedOrder.subtotal)}</span>
                          </div>
                          {selectedOrder.discount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Discount</span>
                              <span className="text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-semibold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">{formatCurrency(selectedOrder.totalprice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
      
                    {/* Actions */}
                    {selectedOrder.status === 'pending' && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedOrder._id, 'cancelled');
                            setSelectedOrder(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                        >
                          Cancel Order
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedOrder._id, 'confirmed');
                            setSelectedOrder(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Confirm Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
    </motion.div>
  );
};

export default OrderList;