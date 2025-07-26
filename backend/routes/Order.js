import express from "express";
import { rateLimit } from 'express-rate-limit'
import { createOrder, deleteOrder, updateStatus, updateDeliveryAgent, getOrders } from '../controllers/Order.js'
import { authenticateUser } from '../middleware/AuthMiddleware.js'
const router = express.Router();
// Rate limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.

})

router.post("/createOrder",authenticateUser, createOrder);

router.delete("/deleteOrder", limiter, authenticateUser, deleteOrder);

router.put("/updateStatus", limiter, authenticateUser, updateStatus);

router.patch("/updateDeliveryAgent", limiter, authenticateUser, updateDeliveryAgent);

router.get("/getOrders/:token", authenticateUser, getOrders);

export default router;