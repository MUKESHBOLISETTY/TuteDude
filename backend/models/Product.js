import mongoose from 'mongoose';

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

const productSchema  = new mongoose.Schema({

    productId:{
        type:String,
        unique:true
    },
     name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Spices'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  minOrderQty: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
   bulkDiscounts: {
    type: [bulkDiscountSchema],
    default: []
  }

}, {
  timestamps: true
})

export const Product = mongoose.model("Product",productSchema);