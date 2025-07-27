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
import { setProducts, setFilteredProducts } from '../redux/supplier/productSlice';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { setUserProducts } from '../redux/supplier/userProductSlice';
import { useNavigate } from 'react-router-dom';
import { setOrders } from '../redux/supplier/orderSlice';

export const useSSE = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, token, user, error, email } = useSelector((state) => state.auth);

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
        eventSource.addEventListener('initial_user_data', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received initial user data (SSE):', data);
                dispatch(setUser(data));
                dispatch(setEmail(data.email));
                dispatch(setOrders(data.orders));
                dispatch(setProducts(data.products || []));
                dispatch(setFilteredProducts(data.products || []));
                dispatch(setLoading(false));

                // Add navigation based on user type
                if (data.type === 'Buyer') {
                    navigate('/', { replace: true });
                } else if (data.type === 'Seller') {
                    navigate('/supplier', { replace: true });
                }
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
                dispatch(setOrders(data.orders));
                const productdata = data.products ? data.products : []
                dispatch(setProducts(productdata));
                dispatch(setFilteredProducts(productdata));

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
                toast('Real-time updates disconnected. Please log in again.', {
                    duration: 3000,
                    icon: '⚠️',
                });
            } else {
                dispatch(setError('Real-time updates encountered an error.'));
            }
        });

        eventSource.onerror = (event) => {
            console.error('Generic EventSource error:', event);
        };
    }, [token, dispatch, navigate]); // Add navigate to dependency array

    const setupProductsSSE = useCallback(() => {
        if (!token) {
            // dispatch(setError("Authentication required for real-time updates."));
            return;
        }
        const sseUrl = `http://localhost:4000/api/v1/product/getProducts`;
        const eventSource = new EventSource(sseUrl);
        //dispatch(setLoading(true));

        eventSource.onopen = () => {
            console.log('SSE Products connection opened.');
        };

        eventSource.addEventListener('initial_product_data', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received initial product data (SSE):', data);
                dispatch(setUserProducts(data));
                // dispatch(setLoading(false));
            } catch (e) {
                console.error('Error parsing initial SSE data:', e);
                dispatch(setOrderError('Failed to parse initial order data.'));
                // dispatch(setLoading(false));
            }
        });

        eventSource.addEventListener('products_update', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received products update (SSE):', data);
                //dispatch(setOrders(data));
                // dispatch(setLoading(false))
            } catch (e) {
                console.error('Error parsing user update SSE data:', e);
                // dispatch(setError('Failed to parse real-time user update.'));
            }
        });

        eventSource.addEventListener('restricted', (event) => {
            console.log('SSE Error:', event);
            eventSource.close();
            // return () => {
            //     console.log('Closing SSE connection.');
            //     eventSource.close();
            // };
            // dispatch(setLoading(false));
            if (event.target && event.target.readyState === EventSource.CLOSED) {
                console.log('SSE connection closed by server.');
                //dispatch(setError('Real-time updates disconnected. Please re-authenticate.'));
                // dispatch(setToken(null));
                // dispatch(setUser(null));
                // localStorage.removeItem("token");
                // localStorage.removeItem("email");


            } else {
                // dispatch(setError('Real-time updates encountered an error.'));
            }
        });

        eventSource.addEventListener('error', (event) => {
            console.error('SSE Error:', event);
            // dispatch(setLoading(false));
            if (event.target && event.target.readyState === EventSource.CLOSED) {
                console.log('SSE connection closed by server.');
                dispatch(setError('Real-time updates disconnected. Please re-authenticate.'));
                // dispatch(setToken(null));
                // dispatch(setUser(null));
                // localStorage.removeItem("token");
                // localStorage.removeItem("email");

            } else {
                // dispatch(setError('Real-time updates encountered an error.'));
            }
        });

        eventSource.onerror = (event) => {
            console.error('Generic EventSource error:', event);
        };

        return () => {
            console.log('Closing Products SSE connection.');
            eventSource.close();
        };
    }, [token, dispatch])

    return {
        loading,
        token,
        user,
        error,
        setupUserSSE,
        setupProductsSSE
    };
}



export default useSSE;