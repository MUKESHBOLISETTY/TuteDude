export const supplierProfile = {
  _id: "65f2a1b3c4d5e6f7a8b9c0d1",
  sellerName: "Bharat Fresh Supplies Pvt. Ltd.",
  contactPersonName: "Rajesh Kumar",
  email: "rajesh.kumar@bharatfresh.com",
  phoneNumber: "+919876543210",
  alternatePhoneNumber: "+917890123456",
  address: {
    street: "15, Industrial Area, Phase 1",
    city: "Bengaluru",
    state: "Karnataka",
    zipCode: "560044"
  },
  businessType: "Wholesaler",
  yearsInBusiness: 12,
  businessRegistrationNumber: "U74999KA2010PTC055555",
  taxIdentificationNumber: "29ABCDE1234F1Z5",
  businessDescription: "Leading supplier of fresh vegetables, fruits, and dairy products to street food vendors and restaurants across Bengaluru.",
  productCategories: ["Vegetables", "Fruits", "Dairy", "Spices"],
  ratings: {
    averageRating: 4.7,
    numberOfReviews: 156
  },
  averageResponseTime: "Within 30 minutes",
  isFeaturedSeller: false,
  rewardPoints: 1250
};

export const mockProducts = [
  {
    id: "prod001",
    name: "Potatoes (A-grade)",
    category: "Vegetables",
    unit: "kg",
    price: 25,
    stock: 500,
    minOrderQty: 10,
    qualityScore: 4.8,
    expiryDate: "2025-02-15",
    isExpired: false,
    bulkDiscounts: [
      { minQty: 20, discount: 5 },
      { minQty: 50, discount: 10 },
      { minQty: 100, discount: 15 }
    ],
    origin: "Karnataka",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-20"
  },
  {
    id: "prod002",
    name: "Onions (Nashik)",
    category: "Vegetables",
    unit: "kg",
    price: 30,
    stock: 15,
    minOrderQty: 5,
    qualityScore: 4.6,
    expiryDate: "2025-02-10",
    isExpired: false,
    bulkDiscounts: [
      { minQty: 25, discount: 8 },
      { minQty: 75, discount: 12 }
    ],
    origin: "Maharashtra",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-18"
  },
  {
    id: "prod003",
    name: "Tomatoes (Hybrid)",
    category: "Vegetables",
    unit: "kg",
    price: 40,
    stock: 8,
    minOrderQty: 5,
    qualityScore: 4.7,
    expiryDate: "2025-01-28",
    isExpired: false,
    bulkDiscounts: [
      { minQty: 15, discount: 6 },
      { minQty: 40, discount: 11 }
    ],
    origin: "Karnataka",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-19"
  },
  {
    id: "prod004",
    name: "Milk (Full Cream)",
    category: "Dairy",
    unit: "liter",
    price: 55,
    stock: 200,
    minOrderQty: 10,
    qualityScore: 4.9,
    expiryDate: "2025-01-30",
    isExpired: false,
    bulkDiscounts: [
      { minQty: 30, discount: 7 },
      { minQty: 60, discount: 12 }
    ],
    origin: "Local Dairy",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-20"
  },
  {
    id: "prod005",
    name: "Paneer (Fresh)",
    category: "Dairy",
    unit: "kg",
    price: 280,
    stock: 25,
    minOrderQty: 2,
    qualityScore: 4.8,
    expiryDate: "2025-01-27",
    isExpired: false,
    bulkDiscounts: [
      { minQty: 5, discount: 5 },
      { minQty: 10, discount: 10 }
    ],
    origin: "Local Dairy",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-19"
  },
  {
    id: "prod006",
    name: "Turmeric Powder",
    category: "Spices",
    unit: "kg",
    price: 120,
    stock: 50,
    minOrderQty: 1,
    qualityScore: 4.9,
    expiryDate: "2026-01-01",
    isExpired: false,
    bulkDiscounts: [
      { minQty: 10, discount: 8 },
      { minQty: 25, discount: 15 }
    ],
    origin: "Tamil Nadu",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-15"
  }
];

export const mockOrders = [
  {
    id: "ORD-001",
    vendorName: "Ramesh Kumar",
    vendorEmail: "ramesh@streetfood.com",
    vendorPhone: "+919123456789",
    items: [
      { productId: "prod001", productName: "Potatoes (A-grade)", quantity: 25, unit: "kg", price: 25, total: 625 },
      { productId: "prod002", productName: "Onions (Nashik)", quantity: 15, unit: "kg", price: 30, total: 450 }
    ],
    subtotal: 1075,
    discount: 0,
    total: 1075,
    status: "pending",
    deliveryStatus: "pending",
    orderDate: "2025-01-24T10:30:00Z",
    estimatedDelivery: "2025-01-25T14:00:00Z",
    deliveryAddress: "123 Street Food Corner, MG Road, Bengaluru",
    paymentStatus: "pending",
    paymentMethod: "UPI"
  },
  {
    id: "ORD-002",
    vendorName: "Priya Snacks",
    vendorEmail: "priya@snacks.com",
    vendorPhone: "+919876543210",
    items: [
      { productId: "prod003", productName: "Tomatoes (Hybrid)", quantity: 20, unit: "kg", price: 40, total: 800 },
      { productId: "prod004", productName: "Milk (Full Cream)", quantity: 30, unit: "liter", price: 55, total: 1650 }
    ],
    subtotal: 2450,
    discount: 58,
    total: 2392,
    status: "confirmed",
    deliveryStatus: "packed",
    orderDate: "2025-01-23T15:45:00Z",
    estimatedDelivery: "2025-01-24T16:00:00Z",
    deliveryAddress: "456 Food Plaza, Brigade Road, Bengaluru",
    paymentStatus: "paid",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "ORD-003",
    vendorName: "Delhi Chaat House",
    vendorEmail: "delhi@chaat.com",
    vendorPhone: "+919555666777",
    items: [
      { productId: "prod005", productName: "Paneer (Fresh)", quantity: 5, unit: "kg", price: 280, total: 1400 },
      { productId: "prod006", productName: "Turmeric Powder", quantity: 2, unit: "kg", price: 120, total: 240 }
    ],
    subtotal: 1640,
    discount: 70,
    total: 1570,
    status: "confirmed",
    deliveryStatus: "shipped",
    orderDate: "2025-01-22T09:20:00Z",
    estimatedDelivery: "2025-01-23T12:00:00Z",
    deliveryAddress: "789 Market Street, Commercial Street, Bengaluru",
    paymentStatus: "paid",
    paymentMethod: "Cash on Delivery"
  },
  {
    id: "ORD-004",
    vendorName: "South Indian Foods",
    vendorEmail: "south@foods.com",
    vendorPhone: "+919333444555",
    items: [
      { productId: "prod001", productName: "Potatoes (A-grade)", quantity: 50, unit: "kg", price: 25, total: 1250 },
      { productId: "prod003", productName: "Tomatoes (Hybrid)", quantity: 40, unit: "kg", price: 40, total: 1600 }
    ],
    subtotal: 2850,
    discount: 285,
    total: 2565,
    status: "completed",
    deliveryStatus: "delivered",
    orderDate: "2025-01-21T11:15:00Z",
    estimatedDelivery: "2025-01-22T15:30:00Z",
    actualDelivery: "2025-01-22T14:45:00Z",
    deliveryAddress: "321 Traditional Foods, Jayanagar, Bengaluru",
    paymentStatus: "paid",
    paymentMethod: "UPI"
  }
];

export const dashboardStats = {
  totalProducts: mockProducts.length,
  totalOrders: mockOrders.length,
  pendingDeliveries: mockOrders.filter(order => order.deliveryStatus !== 'delivered').length,
  totalEarnings: mockOrders.reduce((sum, order) => sum + order.total, 0),
  lowStockProducts: mockProducts.filter(product => product.stock < 20).length,
  monthlyGrowth: {
    products: 7,
    orders: 15,
    deliveries: 12,
    earnings: 8
  }
};