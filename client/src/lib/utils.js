import { format, isWithinInterval, subDays } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  return format(new Date(date), formatString);
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
};

export const getExpiringProducts = (products, days = 7) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  
  return products.filter(product => {
    const expiryDate = new Date(product.expiryDate);
    return expiryDate <= targetDate && expiryDate >= new Date();
  });
};

export const getLowStockProducts = (products, threshold = 20) => {
  return products.filter(product => product.stock < threshold);
};

export const calculateBulkDiscount = (product, quantity) => {
  if (!product.bulkDiscounts || product.bulkDiscounts.length === 0) {
    return { discount: 0, discountAmount: 0 };
  }

  const applicableDiscounts = product.bulkDiscounts
    .filter(d => quantity >= d.minQty)
    .sort((a, b) => b.discount - a.discount);

  if (applicableDiscounts.length === 0) {
    return { discount: 0, discountAmount: 0 };
  }

  const bestDiscount = applicableDiscounts[0];
  const subtotal = product.price * quantity;
  const discountAmount = (subtotal * bestDiscount.discount) / 100;

  return {
    discount: bestDiscount.discount,
    discountAmount,
    total: subtotal - discountAmount,
  };
};

export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getDeliveryStatusColor = (status) => {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    packed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const sortProducts = (products, sortBy, sortOrder = 'asc') => {
  return [...products].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'expiryDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
};

export const filterOrdersByDateRange = (orders, days) => {
  if (days === 'all') return orders;
  
  const startDate = subDays(new Date(), parseInt(days));
  const endDate = new Date();

  return orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return isWithinInterval(orderDate, { start: startDate, end: endDate });
  });
};

export const calculateOrderStats = (orders) => {
  const stats = {
    total: orders.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  };

  orders.forEach(order => {
    stats[order.status] += 1;
    if (order.status !== 'cancelled') {
      stats.totalRevenue += order.total;
    }
  });

  return stats;
};

export const generateProductId = () => {
  return `prod${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
};

export const validateProduct = (product) => {
  const errors = {};

  if (!product.name || product.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  }

  if (!product.category) {
    errors.category = 'Category is required';
  }

  if (!product.unit) {
    errors.unit = 'Unit is required';
  }

  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (product.stock === undefined || product.stock < 0) {
    errors.stock = 'Stock cannot be negative';
  }

  if (!product.minOrderQty || product.minOrderQty <= 0) {
    errors.minOrderQty = 'Minimum order quantity must be greater than 0';
  }

  if (!product.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else {
    const expiryDate = new Date(product.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate <= today) {
      errors.expiryDate = 'Expiry date must be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};