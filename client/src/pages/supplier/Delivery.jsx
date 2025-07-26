import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Truck, Clock, CheckCircle, MapPin, Phone } from 'lucide-react';
import { updateDeliveryStatus } from '../../redux/supplier/deliverySlice';
import { formatCurrency, formatDateTime, getDeliveryStatusColor } from '../../lib/utils';

const Delivery = () => {
  const dispatch = useDispatch();
  const { deliveries } = useSelector(state => state.deliveries);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleStatusUpdate = (orderId, status) => {
    dispatch(updateDeliveryStatus({ orderId, status }));
  };

  const deliveryStats = {
    pending: deliveries.filter(d => d.deliveryStatus === 'pending').length,
    packed: deliveries.filter(d => d.deliveryStatus === 'packed').length,
    shipped: deliveries.filter(d => d.deliveryStatus === 'shipped').length,
    delivered: deliveries.filter(d => d.deliveryStatus === 'delivered').length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'packed': return CheckCircle;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Tracking</h1>
          <p className="text-gray-600">Monitor and update delivery status for your orders</p>
        </div>
      </div>

      {/* Delivery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-600">{deliveryStats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Packed</p>
              <p className="text-2xl font-bold text-blue-600">{deliveryStats.packed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">{deliveryStats.shipped}</p>
            </div>
            <Truck className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{deliveryStats.delivered}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Delivery List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Deliveries</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {deliveries.map((delivery) => {
            const StatusIcon = getStatusIcon(delivery.deliveryStatus);
            
            return (
              <div key={delivery.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <StatusIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <h3 className="font-medium text-gray-900">{delivery.id}</h3>
                      <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getDeliveryStatusColor(delivery.deliveryStatus)}`}>
                        {delivery.deliveryStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Vendor</p>
                        <p className="text-sm text-gray-600">{delivery.vendorName}</p>
                        <div className="flex items-center mt-1">
                          <Phone className="w-3 h-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">{delivery.vendorPhone}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Order Details</p>
                        <p className="text-sm text-gray-600">
                          {delivery.items.length} items • {formatCurrency(delivery.total)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Ordered: {formatDateTime(delivery.orderDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Delivery Info</p>
                        <p className="text-sm text-gray-600">
                          Est: {formatDateTime(delivery.estimatedDelivery)}
                        </p>
                        {delivery.actualDelivery && (
                          <p className="text-xs text-green-600 mt-1">
                            Delivered: {formatDateTime(delivery.actualDelivery)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    {delivery.deliveryStatus === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery.id, 'packed')}
                        className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                      >
                        Mark as Packed
                      </button>
                    )}
                    {delivery.deliveryStatus === 'packed' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery.id, 'shipped')}
                        className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {delivery.deliveryStatus === 'shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedDelivery(delivery)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {deliveries.length === 0 && (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active deliveries</h3>
            <p className="text-gray-500">All orders are either pending confirmation or completed</p>
          </div>
        )}
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <CheckCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Delivery Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Timeline</h3>
                <div className="space-y-4">
                  {[
                    { status: 'pending', label: 'Order Confirmed', completed: true },
                    { status: 'packed', label: 'Items Packed', completed: ['packed', 'shipped', 'delivered'].includes(selectedDelivery.deliveryStatus) },
                    { status: 'shipped', label: 'Out for Delivery', completed: ['shipped', 'delivered'].includes(selectedDelivery.deliveryStatus) },
                    { status: 'delivered', label: 'Delivered', completed: selectedDelivery.deliveryStatus === 'delivered' },
                  ].map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        step.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {step.completed && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className={`ml-3 text-sm ${
                        step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Items to Deliver</h3>
                <div className="space-y-3">
                  {selectedDelivery.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} {item.unit}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vendor</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDelivery.vendorName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDelivery.vendorPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDelivery.deliveryAddress}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedDelivery.estimatedDelivery)}</p>
                    </div>
                    {selectedDelivery.actualDelivery && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Actual Delivery</label>
                        <p className="mt-1 text-sm text-green-600">{formatDateTime(selectedDelivery.actualDelivery)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;