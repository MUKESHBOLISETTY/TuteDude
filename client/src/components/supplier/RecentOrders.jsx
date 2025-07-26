import React from 'react';
import { useSelector } from 'react-redux';
import { Clock, Eye } from 'lucide-react';
import { formatCurrency, formatDateTime, getOrderStatusColor } from '../../lib/utils';

const RecentOrders = () => {
  const { orders } = useSelector(state => state.orders);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-500">Latest orders from your vendors</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{order.id}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{order.vendorName}</p>
                <p className="text-xs text-gray-500">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatDateTime(order.orderDate)}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(order.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {order.status === 'pending' ? 'ordered' : order.deliveryStatus}
                </p>
              </div>
            </div>
          ))}
        </div>

        {recentOrders.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent orders</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700">
            <Eye className="w-4 h-4 mr-2" />
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;