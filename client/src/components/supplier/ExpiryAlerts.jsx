import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, Clock, Package } from 'lucide-react';
import { getExpiringProducts, formatDate } from '../../lib/utils';

const ExpiryAlerts = () => {
  const { products } = useSelector(state => state.products);
  const [selectedDays, setSelectedDays] = useState(7);
  
  const expiringProducts = getExpiringProducts(products, selectedDays);

  const dayOptions = [
    { value: 3, label: '3 days' },
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Expiry Alerts</h3>
          </div>
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {dayOptions.map(option => (
              <option key={option.value} value={option.value}>
                Products expiring within {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6">
        {expiringProducts.length > 0 ? (
          <div className="space-y-3">
            {expiringProducts.map((product) => {
              const daysToExpiry = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
              const productId = product._id.toString()
              return (
                <div key={productId} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock} {product.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-700">
                      {daysToExpiry === 0 ? 'Expires today' : `${daysToExpiry} days left`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(product.expiryDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products expiring soon</p>
            <p className="text-sm text-gray-400 mt-1">
              All products are within safe expiry periods
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiryAlerts;