// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// class ApiService {
//   // Dashboard API
//   async getDashboardStats() {
//     await delay(500);
//     return {
//       success: true,
//       data: {
//         totalProducts: 6,
//         totalOrders: 4,
//         pendingDeliveries: 3,
//         totalEarnings: 7650,
//         lowStockProducts: 2,
//         monthlyGrowth: {
//           products: 7,
//           orders: 15,
//           deliveries: 12,
//           earnings: 8
//         }
//       }
//     };
//   }

//   // Products API
//   async getProducts() {
//     await delay(300);
//     return {
//       success: true,
//       data: [] // Will be populated from Redux store
//     };
//   }

//   async createProduct(productData) {
//     await delay(500);
//     return {
//       success: true,
//       data: { ...productData, id: `prod${Date.now()}` },
//       message: 'Product created successfully'
//     };
//   }

//   async updateProduct(id, productData) {
//     await delay(500);
//     return {
//       success: true,
//       data: { ...productData, id },
//       message: 'Product updated successfully'
//     };
//   }

//   async deleteProduct(id) {
//     await delay(300);
//     return {
//       success: true,
//       message: 'Product deleted successfully'
//     };
//   }

//   // Orders API
//   async getOrders() {
//     await delay(400);
//     return {
//       success: true,
//       data: [] // Will be populated from Redux store
//     };
//   }

//   async updateOrderStatus(orderId, status) {
//     await delay(400);
//     return {
//       success: true,
//       message: `Order ${orderId} status updated to ${status}`
//     };
//   }

//   // Delivery API
//   async getDeliveries() {
//     await delay(300);
//     return {
//       success: true,
//       data: [] // Will be populated from Redux store
//     };
//   }

//   async updateDeliveryStatus(orderId, status, estimatedTime) {
//     await delay(500);
//     return {
//       success: true,
//       message: `Delivery status updated to ${status}`,
//       data: { orderId, status, estimatedTime }
//     };
//   }

//   // Bulk Operations
//   async updateBulkPricing(productId, bulkDiscounts) {
//     await delay(600);
//     return {
//       success: true,
//       message: 'Bulk pricing updated successfully',
//       data: { productId, bulkDiscounts }
//     };
//   }

//   async generateReport(type, dateRange) {
//     await delay(1000);
//     return {
//       success: true,
//       message: `${type} report generated successfully`,
//       data: {
//         reportId: `rpt${Date.now()}`,
//         type,
//         dateRange,
//         downloadUrl: `/reports/rpt${Date.now()}.pdf`
//       }
//     };
//   }
// }


import axios from 'axios';
import store from '../redux/store';
import toast from 'react-hot-toast';
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Add response interceptor to handle common errors
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    //if (error.response?.status === 401) {
    if (error.response?.data.message) {
      console.error('API Error:', error.response.data.message);
      toast.error(error.response.data.message, {
        duration: 3000,
        position: 'bottom-right',
        icon: '⚠️',
      })
    }
    return Promise.reject(error);
  }
);



// AUTH ENDPOINTS
export const authApi = {
  login: (data) => apiService.post('/auth/login', data),
  signup: (data) => apiService.post('/auth/signup', data),
  verifyOtp: (email, otp) => apiService.post('/auth/verifyOtp', { email, otp }),
  resendOtp: (email) => apiService.post('/auth/resendOtp', { email }),

  // Password Management
  sendForgotPasswordOtp: (email) => apiService.post('/auth/sendForgotPasswordOtp', { email }),
  verifyForgotPasswordOtp: (email, otp) => apiService.post('/auth/verifyForgotPasswordOtp', { email, otp }),
  resetPassword: (data) => apiService.post('/auth/resetPassword', data),

  // User Management
  deleteUser: (userId) => apiService.delete('/auth/deleteUser', { userId }),
  updateUser: (username, phonenumber) => apiService.put('/auth/updateUser', { username, phonenumber }),
  changePassword: (newPassword, confirmPassword, currentPassword) => apiService.post('/auth/changePassword', { newPassword, confirmPassword, currentPassword }),
  //getUser: (email) => apiService.put('/auth/getUser', { email }),

  // Address Management
  addNewAddress: (data) => apiService.post('/auth/addAddress', data),
  updateAddress: (addressId, data) => apiService.post('/auth/updateAddress', { addressId, data }),
  deleteAddress: (addressId) => apiService.put('/auth/deleteAddress', { addressId }),


}

export const OrderApi = {
  createOrder:(data)=> apiService.post('/orders/createOrder',data),
  updateStatus:(orderId,newStatus) => apiService.put('/orders/updateStatus',{orderId,deliveryStatus:newStatus})

}
export const productsApi = {
  // Products Management
  addProduct: (data) => apiService.post('/product/createProduct', data),
  updateProduct: (id, data) => apiService.post(`/product/updateProduct/${id}`, data),
  deleteProduct: (id) => apiService.delete(`/product/deleteProduct/${id}`)

}

export default apiService; 