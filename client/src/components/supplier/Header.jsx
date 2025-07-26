import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const Header = ({ title }) => {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your supply operations.
          </p>
        </div>

        <div className="flex items-center space-x-4">
         
          {/* Date */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {today.split(',')[0]}
            </p>
            <p className="text-xs text-gray-500">
              {today.split(',')[1]}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;