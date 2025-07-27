import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './redux/store';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import VerifyOTP from './pages/auth/VerifyOTP';
import SupplierLayout from './layouts/SupplierLayout';
import Dashboard from './pages/supplier/Dashboard';
import Products from './pages/supplier/Products';
import Orders from './pages/supplier/Orders';
import Delivery from './pages/supplier/Delivery';
import Earnings from './pages/supplier/Earnings';
import NotFound from "./pages/NotFound";
import { useDispatch, useSelector } from 'react-redux';
import useSSE from './hooks/useSSE';
import useOrders from './hooks/useOrders';
import toast, { Toaster } from 'react-hot-toast';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import ProtectedRoute from './ProtectedRoute';
// const SellerRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.auth);

//   if (user.type !== 'Seller') {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

function AppContent() {
  const { token, user } = useSelector((state) => state.auth);
  const { setupUserSSE, setupProductsSSE } = useSSE()

  useEffect(() => {
    if (token) {
      const cleanup = setupUserSSE();
      return cleanup;
    }
  }, [token, setupUserSSE]);
  useEffect(() => {
    const cleanup = setupProductsSSE();
    return cleanup;
  }, [token, setupProductsSSE]);

  const { setupOrdersSSE } = useOrders();
  useEffect(() => {
    if (token) {
      const cleanup = setupOrdersSSE();
      return cleanup;
    }
  }, [token, setupOrdersSSE]);

  return (
    <>
      <Toaster />
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth/signup" element={<>{user ? <NotFound /> : <SignUp />}</>} />
        <Route path="/auth/login" element={<>{user ? <NotFound /> : <Login />}</>} />
        <Route path="/auth/verifyotp/:email" element={<VerifyOTP />} />

        {/* <Route path="/supplier" element={<>{user?.type == "Seller" ?
          <SupplierLayout /> : <Login />}</>}> */}
          <Route path="/supplier" element={<SupplierLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="earnings" element={<Earnings />} />
        </Route>
        {/* BUYER DASHBOARD */}
        <Route path='/' element={
          <>{user?.type == "Buyer" ?
            <BuyerDashboard />
            : <Login />}</>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;