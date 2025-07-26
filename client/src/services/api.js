// Mock API service for demonstration purposes
// In a real application, these would make actual HTTP requests

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  // Dashboard API
  async getDashboardStats() {
    await delay(500);
    return {
      success: true,
      data: {
        totalProducts: 6,
        totalOrders: 4,
        pendingDeliveries: 3,
        totalEarnings: 7650,
        lowStockProducts: 2,
        monthlyGrowth: {
          products: 7,
          orders: 15,
          deliveries: 12,
          earnings: 8
        }
      }
    };
  }

  // Products API
  async getProducts() {
    await delay(300);
    return {
      success: true,
      data: [] // Will be populated from Redux store
    };
  }

  async createProduct(productData) {
    await delay(500);
    return {
      success: true,
      data: { ...productData, id: `prod${Date.now()}` },
      message: 'Product created successfully'
    };
  }

  async updateProduct(id, productData) {
    await delay(500);
    return {
      success: true,
      data: { ...productData, id },
      message: 'Product updated successfully'
    };
  }

  async deleteProduct(id) {
    await delay(300);
    return {
      success: true,
      message: 'Product deleted successfully'
    };
  }

  // Orders API
  async getOrders() {
    await delay(400);
    return {
      success: true,
      data: [] // Will be populated from Redux store
    };
  }

  async updateOrderStatus(orderId, status) {
    await delay(400);
    return {
      success: true,
      message: `Order ${orderId} status updated to ${status}`
    };
  }

  // Delivery API
  async getDeliveries() {
    await delay(300);
    return {
      success: true,
      data: [] // Will be populated from Redux store
    };
  }

  async updateDeliveryStatus(orderId, status, estimatedTime) {
    await delay(500);
    return {
      success: true,
      message: `Delivery status updated to ${status}`,
      data: { orderId, status, estimatedTime }
    };
  }

  // Bulk Operations
  async updateBulkPricing(productId, bulkDiscounts) {
    await delay(600);
    return {
      success: true,
      message: 'Bulk pricing updated successfully',
      data: { productId, bulkDiscounts }
    };
  }

  async generateReport(type, dateRange) {
    await delay(1000);
    return {
      success: true,
      message: `${type} report generated successfully`,
      data: {
        reportId: `rpt${Date.now()}`,
        type,
        dateRange,
        downloadUrl: `/reports/rpt${Date.now()}.pdf`
      }
    };
  }
}

export const apiService = new ApiService();
export default apiService;