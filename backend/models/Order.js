import mongoose from "mongoose";
// import { sendOrdersUpdate } from "../controllers/OrderManagement.js";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        customer: {
            customerName: { type: String, required: true },
            customerId: { type: String, required: true },
            customerEmail: { type: String, required: true },
            customerPhoneNumber: { type: String, required: true }
        },
        delivery: {
            address: { type: String, required: true },
            distance: { type: Number, required: true },
            deliveryfee: { type: Number, required: true },
            deliveryagentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            deliveredOn: { type: Date, default: null },
            paymentmethod: { type: String, enum: ["payondelivery", "upi"], required: true },
        },
        items: [{
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            add_ons: { type: Array }
        }],
        subtotal: { type: Number, required: true },
        totalprice: { type: Number, require: true },
        status: {
            type: String,
            enum: ["pending", "processing", "out of delivery", "completed", "cancelled"],
            default: "pending",
            required: true
        },
        deliveryStatus:{
            type:String,
            enum:["pending","packed","shipped","delivered"],
            default:"pending",
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
