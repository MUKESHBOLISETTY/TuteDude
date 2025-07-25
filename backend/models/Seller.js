import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    // I. Basic Seller Information
    sellerName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPersonName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    alternatePhoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },

    // II. Business Details
    businessType: {
      type: String,
      enum: ['Wholesaler', 'Distributor', 'Farmer', 'Manufacturer', 'Retailer'],
      required: true,
    },
    yearsInBusiness: {
      type: Number,
      min: 0,
    },
    businessRegistrationNumber: {
      type: String,
      trim: true,
    },
    taxIdentificationNumber: {
      type: String,
      trim: true,
    },
    businessDescription: {
      type: String,
      trim: true,
      maxLength: 500,
    },

    // III. Product/Inventory Information
    productCategories: {
      type: [String],
      default: [],
    },
    specificProductsOffered: {
      type: [String],
      default: [],
    },
    minimumOrderQuantity: {
      type: Number,
      min: 0,
    },
    pricingStructure: {
      type: String,
      trim: true,
    },
    stockAvailability: {
      type: String,
      trim: true,
    },
    productOrigin: {
      type: String,
      trim: true,
    },
    certifications: {
      type: [String],
      default: [],
    },

    // IV. Logistics & Delivery
    delivery: {
      areas: {
        type: [String],
        default: [],
      },
      schedule: {
        type: String,
        trim: true,
      },
      timeframe: {
        type: String,
        trim: true,
      },
      fees: {
        type: String,
        trim: true,
      },
      packagingInformation: {
        type: String,
        trim: true,
      },
      pickupOption: {
        type: Boolean,
        default: false,
      },
    },

    // V. Payment Information
    payment: {
      acceptedMethods: {
        type: [String],
        default: [],
      },
      terms: {
        type: String,
        trim: true,
      },
      bankAccountDetails: {
        accountName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        ifscSwiftCode: { type: String, trim: true },
      },
    },

    // VI. Account & Security
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // password: { type: String, required: true }, // Handle securely via auth service
    profilePictureUrl: {
      type: String,
      trim: true,
    },
    termsAndConditionsAccepted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // VII. Optional/Advanced Attributes
    ratings: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
      },
      numberOfReviews: {
        type: Number,
        min: 0,
      },
    },
    averageResponseTime: {
      type: String,
      trim: true,
    },
    isFeaturedSeller: {
      type: Boolean,
      default: false,
    },
    socialMediaLinks: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      website: { type: String, trim: true },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const Seller = mongoose.model('Seller', sellerSchema);

