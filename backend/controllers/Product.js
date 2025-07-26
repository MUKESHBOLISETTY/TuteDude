import { sendUserUpdater } from '../middleware/ServerSentUpdates.js';
import { Product } from '../models/Product.js';
import { Seller } from '../models/Seller.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Destructure all required fields from request body
    const {
      name,
      category,
      price,
      unit,
      stock,
      minOrderQty,
      expiryDate,
      qualityScore,
      bulkDiscounts,
      origin
    } = req.body;

    // Required field validation
    const requiredFields = { name, category, price, unit, stock, minOrderQty, expiryDate, origin };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate price and quantities
    if (price <= 0 || stock < 0 || minOrderQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price and quantities must be positive numbers'
      });
    }

    // Validate unit
    const validUnits = ['kg', 'g', 'l', 'ml', 'pieces'];
    if (!validUnits.includes(unit)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid unit. Must be one of: ' + validUnits.join(', ')
      });
    }

    // Validate bulk discounts if provided
    if (bulkDiscounts && bulkDiscounts.length > 0) {
      const isValidDiscounts = bulkDiscounts.every(discount =>
        discount.minQty > 0 &&
        discount.discount > 0 &&
        discount.discount < 100
      );

      if (!isValidDiscounts) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bulk discount configuration'
        });
      }
    }

    // Create the product object
    const productData = {
      name,
      category,
      price,
      unit,
      stock,
      minOrderQty,
      expiryDate: new Date(expiryDate),
      qualityScore: qualityScore || 0,
      origin,
      bulkDiscounts: bulkDiscounts || [],
      seller: req.user._id, // Assuming req.user is set by auth middleware
      isExpired: new Date() > new Date(expiryDate)
    };

    // Create and save the product
    const product = new Product(productData);
    await product.save();

    // Update seller's products array
    await Seller.findByIdAndUpdate(
      req.user._id,
      { $push: { products: product._id } }
    );
    await sendUserUpdater(req.user.email)
    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: product._id,
        ...productData,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });


  } catch (error) {
    console.error('Create Product Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
};

// Get all products (with optional filters)
// export const getProducts = async (req, res) => {
//   try {
//     const { search, category, stock, expiry } = req.query;

//     let query = {};

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (category && category !== 'all') {
//       query.category = category;
//     }

//     if (stock === 'low') {
//       query.stock = { $gt: 0, $lt: 20 };
//     } else if (stock === 'out') {
//       query.stock = 0;
//     }

//     if (expiry && expiry !== 'all') {
//       const days = parseInt(expiry);
//       const today = new Date();
//       const targetDate = new Date();
//       targetDate.setDate(today.getDate() + days);
//       query.expiryDate = { $lte: targetDate };
//     }

//     const products = await Product.find(query).sort({ createdAt: -1 });
//     res.json(products);
//   } catch (error) {
//     console.error('Get Products Error:', error);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// };

// Get a single product by ID
export const getProductsData = async (req, res) => {
  try {
    const product = await Product.find({ isExpired: false });
    if (!product) { throw new Error("User not found"); }
    return product
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to retrieve user data`);
  }
};


// Update a product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      category,
      price,
      unit,
      stock,
      minOrderQty,
      expiryDate,
      qualityScore,
      bulkDiscounts,
      origin
    } = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Required field validation
    const requiredFields = { name, category, price, unit, stock, minOrderQty, expiryDate, origin };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate price and quantities
    if (price <= 0 || stock < 0 || minOrderQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price and quantities must be positive numbers'
      });
    }

    // Validate unit
    const validUnits = ['kg', 'g', 'l', 'ml', 'pieces'];
    if (!validUnits.includes(unit)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid unit. Must be one of: ' + validUnits.join(', ')
      });
    }

    // Validate bulk discounts if provided
    if (bulkDiscounts && bulkDiscounts.length > 0) {
      const isValidDiscounts = bulkDiscounts.every(discount =>
        discount.minQty > 0 &&
        discount.discount > 0 &&
        discount.discount < 100
      );

      if (!isValidDiscounts) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bulk discount configuration'
        });
      }
    }

    // Update product data
    const updatedProductData = {
      name,
      category,
      price,
      unit,
      stock,
      minOrderQty,
      expiryDate: new Date(expiryDate),
      qualityScore: qualityScore || existingProduct.qualityScore,
      origin,
      bulkDiscounts: bulkDiscounts || existingProduct.bulkDiscounts,
      isExpired: new Date() > new Date(expiryDate)
    };

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true, runValidators: true }
    );
    await sendUserUpdater(req.user.email)

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update Product Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists and belongs to the seller
    const product = await Product.findOne({
      _id: productId,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    // Remove product from seller's products array
    await Seller.findByIdAndUpdate(
      req.user._id,
      { $pull: { products: productId } }
    );

    // Delete the product
    await Product.findByIdAndDelete(productId);

    // Send real-time update to seller
    await sendUserUpdater(req.user.email);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: {
        id: product._id,
        name: product.name
      }
    });

  } catch (error) {
    console.log('Delete Product Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product'
    });
  }
};
