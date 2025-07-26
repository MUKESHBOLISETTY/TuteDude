import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './redux/store';
import SupplierLayout from './layouts/SupplierLayout';
import Dashboard from './pages/supplier/Dashboard';
import Products from './pages/supplier/Products';
import Orders from './pages/supplier/Orders';
import Delivery from './pages/supplier/Delivery';
import Earnings from './pages/supplier/Earnings';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/supplier" replace />} />
          <Route path="/supplier" element={<SupplierLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="earnings" element={<Earnings />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;