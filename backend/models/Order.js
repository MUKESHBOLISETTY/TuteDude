import mongoose from "mongoose";
import { sendOrdersUpdate } from "../controllers/Order.js";

const orderSchema = new mongoose.Schema(
    {
        orderId: { type: String, required: true },
        customer: {
            customerName: { type: String, required: true },
            customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
            customerEmail: { type: String, required: true },
            customerPhoneNumber: { type: String, required: true }
        },
        delivery: {
            address: { type: String, required: true },
            distance: { type: Number, required: true },
            deliveryfee: { type: Number, required: true },
            sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
            deliveredOn: { type: Date, default: null },
            paymentmethod: { type: String, enum: ["payondelivery", "upi"], required: true },
        },
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }],
        subtotal: { type: Number, required: true },
        totalprice: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "processing", "out of delivery", "completed", "cancelled","confirmed"],
            default: "pending",
            required: true
        },
        deliveryStatus: {
            type: String,
            enum: ["pending", "packed", "shipped", "delivered"],
            default: "pending",
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

orderSchema.post("save", async function () {
    await sendOrdersUpdate()
});

export const Order = mongoose.model("Order", orderSchema);
