import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useToast } from "./useToast";

import { useCallback } from 'react';
import { setOrders } from '../redux/supplier/orderSlice';
import { OrderApi } from '../services/api';

export const useOrders = () => {
    const dispatch = useDispatch();
    // const { toast } = useToast();
    const { token } = useSelector((state) => state.auth);

    const setupOrdersSSE = useCallback(() => {
        if (!token) {
            // dispatch(setError("Authentication required for real-time updates."));
            return;
        }
        const sseUrl = `https://tute-dude-three.vercel.app/api/v1/orders/getOrders/${token}`;
        const eventSource = new EventSource(sseUrl);
        //dispatch(setLoading(true));

        eventSource.onopen = () => {
            console.log('SSE connection opened.');
        };

        eventSource.addEventListener('initial_data', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received initial order data (SSE):', data);
                 dispatch(setOrders(data));
                // dispatch(setLoading(false));
            } catch (e) {
                console.error('Error parsing initial SSE data:', e);
                 dispatch(setOrderError('Failed to parse initial order data.'));
                // dispatch(setLoading(false));
            }
        });

        eventSource.addEventListener('orders_update', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received orders update (SSE):', data);
                 dispatch(setOrders(data));
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
                // toast({
                //     title: "Session Expired",
                //     description: "Your session has ended. Please log in again.",
                //     duration: 3000,
                //     status: "error"
                // });
            } else {
                // dispatch(setError('Real-time updates encountered an error.'));
            }
        });

        eventSource.onerror = (event) => {
            console.error('Generic EventSource error:', event);
        };

        return () => {
          console.log('Closing SSE connection.');
          eventSource.close();
        };
    }, [token, dispatch])

    const updateStatus = async(orderId,newStatus) => {
        try{
            const res = await OrderApi.updateStatus(orderId,newStatus);
            console.log("Response in useOrder for updating status",res);
            return res;

        }catch(error){
            console.log("Error in updating status",error)
        }
    }

    const createOrder = async(data) => {
        try{
            const response = await OrderApi.createOrder(data);
            return response;

        }catch(error){
            console.error("Error in frontend cretainng order:",error)
        }
    }

    return {
        setupOrdersSSE,
        updateStatus,createOrder
    };
}

export default useOrders;
