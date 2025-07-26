import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { updateStats } from '../redux/supplier/dashboardSlice';
import { addProduct, updateProduct, deleteProduct } from '../redux/supplier/productSlice';
import { updateOrderStatus, updateDeliveryStatus } from '../redux/supplier/orderSlice';

export const useSupplierData = () => {
  const dispatch = useDispatch();
  
  const dashboardData = useSelector(state => state.dashboard);
  const productsData = useSelector(state => state.products);
  const ordersData = useSelector(state => state.orders);
  const deliveriesData = useSelector(state => state.deliveries);

  const updateDashboardStats = useCallback((newStats) => {
    dispatch(updateStats(newStats));
  }, [dispatch]);

  const handleProductOperation = useCallback((operation, productData) => {
    switch (operation) {
      case 'add':
        dispatch(addProduct(productData));
        break;
      case 'update':
        dispatch(updateProduct(productData));
        break;
      case 'delete':
        dispatch(deleteProduct(productData.id));
        break;
      default:
        break;
    }
  }, [dispatch]);

  const handleOrderUpdate = useCallback((orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  }, [dispatch]);

  const handleDeliveryUpdate = useCallback((orderId, deliveryStatus, estimatedTime) => {
    dispatch(updateDeliveryStatus({ orderId, deliveryStatus, estimatedTime }));
  }, [dispatch]);

  return {
    dashboardData,
    productsData,
    ordersData,
    deliveriesData,
    updateDashboardStats,
    handleProductOperation,
    handleOrderUpdate,
    handleDeliveryUpdate,
  };
};