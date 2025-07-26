import { Product } from '../models/productModel.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all products (with optional filters)
export const getProducts = async (req, res) => {
  try {
    const { search, category, stock, expiry } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (stock === 'low') {
      query.stock = { $gt: 0, $lt: 20 };
    } else if (stock === 'out') {
      query.stock = 0;
    }

    if (expiry && expiry !== 'all') {
      const days = parseInt(expiry);
      const today = new Date();
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + days);
      query.expiryDate = { $lte: targetDate };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
