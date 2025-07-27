import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  UserGroupIcon, 
  UserIcon, 
  PowerIcon 
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/supplier/authSlice';

// Interface definition removed for JSX conversion
// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

const menuItems = [
  { id: 'home', name: 'Home', icon: HomeIcon },
  { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
  { id: 'products', name: 'My Products', icon: CubeIcon },
  { id: 'group-orders', name: 'Group Orders', icon: UserGroupIcon },
  { id: 'profile', name: 'Profile', icon: UserIcon },
];

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => { // Removed React.FC
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <CubeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">SupplyChain Pro</h1>
                <p className="text-xs text-gray-500">Buyer Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Rajesh Kumar</p>
                <p className="text-sm text-gray-500">★ 4.7 (136 reviews)</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <PowerIcon className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
