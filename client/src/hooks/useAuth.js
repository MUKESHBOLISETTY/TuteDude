import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/api';
// import { useToast } from "./useToast";
import {
  setLoading,
  setToken,
  setUser,
  setError,
  setEmail
} from '../redux/supplier/authSlice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  // const { toast } = useToast();

  const { loading, token, user, error, email } = useSelector((state) => state.auth);

  // const fetchUser = async () => {
  //   try {
  //     const email = localStorage.getItem("email");
  //     dispatch(setLoading(true));
  //     const response = await authApi.getUser(email);
  //     console.log(response)
  //     dispatch(setUser(response.data.user));
  //   } catch (error) {
  //     dispatch(setError(error.message));
  //   }
  // };

  const setupUserSSE = useCallback(() => {
    if (!token) {
      dispatch(setError("Authentication required for real-time updates."));
      return;
    }
    const sseUrl = `http://localhost:4000/api/v1/auth/getUser/${token}/${email}`;
    const eventSource = new EventSource(sseUrl);
    dispatch(setLoading(true));

    eventSource.onopen = () => {
      console.log('SSE connection opened.');
    };

    eventSource.addEventListener('initial_data', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received initial user data (SSE):', data);
        dispatch(setUser(data));
        dispatch(setLoading(false));
      } catch (e) {
        console.error('Error parsing initial SSE data:', e);
        dispatch(setError('Failed to parse initial user data.'));
        dispatch(setLoading(false));
      }
    });

    eventSource.addEventListener('user_update', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received user update (SSE):', data);
        dispatch(setUser(data));
        dispatch(setLoading(false))
      } catch (e) {
        console.error('Error parsing user update SSE data:', e);
        dispatch(setError('Failed to parse real-time user update.'));
      }
    });

    eventSource.addEventListener('error', (event) => {
      console.error('SSE Error:', event);
      dispatch(setLoading(false));
      if (event.target && event.target.readyState === EventSource.CLOSED) {
        console.log('SSE connection closed by server.');
        dispatch(setError('Real-time updates disconnected. Please re-authenticate.'));
        // dispatch(setToken(null));
        // dispatch(setUser(null));
        // localStorage.removeItem("token");
        // localStorage.removeItem("email");
        // toast({
        //   title: "Session Expired",
        //   description: "Your session has ended. Please log in again.",
        //   duration: 3000,
        //   status: "error"
        // });
      } else {
        dispatch(setError('Real-time updates encountered an error.'));
      }
    });

    eventSource.onerror = (event) => {
      console.error('Generic EventSource error:', event);
    };

    // return () => {
    //   console.log('Closing SSE connection.');
    //   eventSource.close();
    // };
  }, [token, dispatch])


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
        // toast({
        //   title: "SignUp",
        //   description: `Check your mail box for otp`,
        //   duration: 2000,
        // });
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
        toast({
          title: "Otp Verification",
          description: `Otp Verified Successfully`,
          duration: 2000,
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
        toast({
          title: "Otp Verification",
          description: `Otp Has Been Sent`,
          duration: 2000,
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
        navigate('/menu')
        toast({
          title: "User Status",
          description: `Logged In`,
          duration: 2000,
        });
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
        toast({
          title: "User Status",
          description: `Changed Password Succesfully`,
          duration: 2000,
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
    setupUserSSE,
    changeUserDetails
  };
};

export default useAuth; 