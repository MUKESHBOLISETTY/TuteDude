import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/Product.js';
import { authenticateUser } from '../middleware/AuthMiddleware.js';
import { getProducts } from '../middleware/ServerSentUpdates.js';

const router = express.Router();

router.post('/createProduct', authenticateUser, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/getProducts', getProducts);

export default router;
