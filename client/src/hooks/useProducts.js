import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productsApi } from '../services/api';
import {
  setLoading,
  setToken,
  setUser,
  setError,
  setEmail
} from '../redux/supplier/authSlice';
import toast from 'react-hot-toast';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { loading, token, user, error, email } = useSelector((state) => state.auth);

  const addProduct = async (productData) => {
    try {
      dispatch(setLoading(true));
      const response = await productsApi.addProduct(productData);
      toast.success('Product added successfully!');
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error('Failed to add product.');
      throw error;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      dispatch(setLoading(true));
      const response = await productsApi.updateProduct(productId, productData);
      toast.success('Product updated successfully!');
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error('Failed to update product.');
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      dispatch(setLoading(true));
      const response = await productsApi.deleteProduct(productId);
      toast.success('Product deleted successfully!');
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error('Failed to delete product.');
      throw error;
    }
  };

  return {
    loading,
    token,
    user,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export default useProducts; 