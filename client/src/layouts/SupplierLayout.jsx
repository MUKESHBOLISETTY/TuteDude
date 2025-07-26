import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/supplier/Sidebar';
import Header from '../components/supplier/Header';

const SupplierLayout = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/products')) return 'Products';
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/delivery')) return 'Delivery';
    if (path.includes('/earnings')) return 'Earnings';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupplierLayout;