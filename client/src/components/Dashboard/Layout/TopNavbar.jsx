import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { toggleProfileDropdown, logout, setUser } from '../../../redux/supplier/authSlice';
import { setSearchQuery } from '../../../redux/supplier/userProductSlice';
import { setUserOrders } from '../../../redux/supplier/orderSlice';

const TopNavbar = ({ onMenuClick, onCartClick, activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const { itemCount } = useSelector((state) => state.cart);
  const { user, showProfileDropdown } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.userproducts.filters);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const handleProfileClick = () => {
    dispatch(toggleProfileDropdown());
  };

    const handleLogout = () => {
      dispatch(setUser(null));
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      setUserOrders([]);
      toast.success('Logged out successfully');
      navigate('/');
    };

  const profileMenuItems = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'profile', name: 'My Profile', icon: UserIcon },
    { id: 'orders', name: 'My Orders', icon: ClipboardDocumentListIcon },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <form onChange={handleSearch} className="hidden sm:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products, suppliers..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  style={{ width: '300px' }}
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="p-2 text-gray-400 hover:text-gray-500 relative"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-green-600" />
                </div>
                <span className="hidden md:block text-gray-700 font-medium">{user?.username}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="py-1">
                      {profileMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              dispatch(toggleProfileDropdown());
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.name}
                          </button>
                        );
                      })}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
