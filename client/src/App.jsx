import React from 'react';
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

function App() {
  const { token, user } = useSelector((state) => state.auth);
  const { setupUserSSE } = useSSE()
  useEffect(() => {
    if (token) {
      const cleanup = setupUserSSE();
      return cleanup;
    }
  }, [token, setupUserSSE]);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/signup" element={<>{user ? <NotFound /> : <SignUp />}</>} />
          <Route path="/auth/login" element={<>{user ? <NotFound /> : <Login />}</>} />
          <Route path="/auth/verifyotp/:email" element={<VerifyOTP />} />

          <Route path="/" element={<Navigate to="/supplier" replace />} />
          <Route path="/supplier" element={<SupplierLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="earnings" element={<Earnings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;