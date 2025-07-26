import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DollarSign, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { formatCurrency, formatDate, calculateOrderStats } from '../../lib/utils';

const Earnings = () => {
  const { orders } = useSelector(state => state.orders);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate earnings based on completed orders
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalEarnings = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = completedOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

  // Monthly earnings calculation
  const getMonthlyEarnings = () => {
    const months = {};
    completedOrders.forEach(order => {
      const date = new Date(order.orderDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[monthKey]) {
        months[monthKey] = { total: 0, orders: 0 };
      }
      months[monthKey].total += order.total;
      months[monthKey].orders += 1;
    });
    return months;
  };

  const monthlyEarnings = getMonthlyEarnings();

  // Top products by revenue
  const getTopProducts = () => {
    const productStats = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productStats[item.productName]) {
          productStats[item.productName] = { revenue: 0, quantity: 0, orders: 0 };
        }
        productStats[item.productName].revenue += item.total;
        productStats[item.productName].quantity += item.quantity;
        productStats[item.productName].orders += 1;
      });
    });

    return Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">Track your revenue and financial performance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="all">All Categories</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Spices">Spices</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="completed">Completed Only</option>
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+8% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm font-medium text-blue-600">+12% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageOrderValue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm font-medium text-purple-600">+5% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(Object.values(monthlyEarnings).slice(-1)[0]?.total || 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm font-medium text-orange-600">+15% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Earnings Trend</h3>
        <div className="space-y-4">
          {Object.entries(monthlyEarnings).map(([month, data]) => {
            const [year, monthNum] = month.split('-');
            const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const maxEarnings = Math.max(...Object.values(monthlyEarnings).map(m => m.total));
            const percentage = (data.total / maxEarnings) * 100;

            return (
              <div key={month} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{monthName}</span>
                    <span className="text-sm text-gray-600">{data.orders} orders</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(data.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Products and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products by Revenue</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">
                    {product.quantity} units sold • {product.orders} orders
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {completedOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{order.id}</h4>
                  <p className="text-sm text-gray-600">
                    {order.vendorName} • {formatDate(order.orderDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;