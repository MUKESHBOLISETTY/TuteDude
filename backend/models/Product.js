import mongoose from 'mongoose';
import { Seller } from './Seller.js';
const bulkDiscountSchema = new mongoose.Schema({
  minQty: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Spices','Breads'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'pieces']
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderQty: {
    type: Number,
    required: true,
    min: 1
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isExpired: {
    type: Boolean,
    default: false
  },
  bulkDiscounts: {
    type: [bulkDiscountSchema],
    default: []
  },
  origin: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  image:{
    type:String
  }
}, {
  timestamps: true
})

productSchema.pre('save', function(next) {
  this.isExpired = new Date() > this.expiryDate;
  next();
});


export const Product = mongoose.model("Product", productSchema);