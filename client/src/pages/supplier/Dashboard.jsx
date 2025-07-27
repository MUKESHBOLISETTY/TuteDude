import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Package, ShoppingCart, Truck, DollarSign, AlertTriangle } from 'lucide-react';
import StatsCard from '../../components/supplier/StatsCard';
import RecentOrders from '../../components/supplier/RecentOrders';
import ExpiryAlerts from '../../components/supplier/ExpiryAlerts';
import { formatCurrency } from '../../lib/utils';

const Dashboard = () => {
  const { stats } = useSelector(state => state.dashboard);

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      growth: stats.monthlyGrowth.products,
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      growth: stats.monthlyGrowth.orders,
      color: 'blue'
    },
    {
      title: 'Pending Deliveries',
      value: stats.pendingDeliveries,
      icon: Truck,
      growth: stats.monthlyGrowth.deliveries,
      color: 'purple'
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(stats.totalEarnings),
      icon: DollarSign,
      growth: stats.monthlyGrowth.earnings,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <ExpiryAlerts />
      </div>
    </div>
  );
};

export default Dashboard;