import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/api';
import {
  setLoading,
  setToken,
  setUser,
  setError,
  setEmail
} from '../redux/supplier/authSlice';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();

  const { loading, token, user, error, email } = useSelector((state) => state.auth);

  const deleteUser = async (userId) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.deleteUser(userId);
      dispatch(setUser(null));
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const signUp = async (data, navigate) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.signup(data);
      if (response.data.message == "User registered successfully") {
        toast('Check your mail box for OTP.', {
          duration: 3000
        })
        navigate(`/auth/verifyotp/${data.email}`)
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const verifyOtp = async (email, otp, navigate) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.verifyOtp(email, otp);
      if (response.data.message === "otpverified") {
        toast('OTP verified successfully.', {
          duration: 2000
        });
        navigate('/auth/login')
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const resendOtp = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.resendOtp(email);
      if (response.data.message == "otpsent") {
        toast('OTP has been sent to your email.', {
          duration: 2000
        });
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const login = async (data, navigate) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.login(data);
      localStorage.setItem("token", response.data.UserSchema.token);
      localStorage.setItem("email", response.data.UserSchema.email);
      dispatch(setToken(response.data.UserSchema.token));
      dispatch(setEmail(response.data.UserSchema.email));
      if (response.data.message == "userlogin") {
        navigate('/')
        toast('Logged in successfully.', {
          duration: 2000
        })
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const sendForgotPassword = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.sendForgotPasswordOtp(email);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const verifyForgotPasswordOtp = async (email, otp) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.verifyForgotPasswordOtp(email, otp);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const resetPassword = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.resetPassword(data);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const changeUserDetails = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.updateUser(data.username, data.phonenumber);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const changePassword = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.changePassword(data.newPassword, data.confirmPassword, data.currentPassword);
      if (response.data.message == "passwordchanged") {
        toast('Password changed successfully.', {
          duration: 2000
        });
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };


  return {
    loading,
    token,
    user,
    error,
    signUp,
    verifyOtp,
    resendOtp,
    login,
    sendForgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    changePassword,
    deleteUser,
    changeUserDetails
  };
};

export default useAuth; 