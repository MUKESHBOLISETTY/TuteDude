import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  Star,
  LogOut,
  User
} from 'lucide-react';
import { supplierProfile } from '../../data/mockData';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/supplier', icon: LayoutDashboard },
    { name: 'Products', href: '/supplier/products', icon: Package },
    { name: 'Orders', href: '/supplier/orders', icon: ShoppingCart },
    { name: 'Delivery', href: '/supplier/delivery', icon: Truck },
    { name: 'Earnings', href: '/supplier/earnings', icon: DollarSign },
  ];

  const isActive = (href) => {
    if (href === '/supplier') {
      return location.pathname === '/supplier';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo and Brand */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">SupplyChain Pro</h2>
            <p className="text-sm text-gray-500">Supplier Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-green-100 text-green-700 border-r-2 border-green-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Supplier Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {supplierProfile.contactPersonName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {supplierProfile.sellerName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {supplierProfile.ratings.averageRating}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({supplierProfile.ratings.numberOfReviews} reviews)
            </span>
          </div>
        </div>

        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;