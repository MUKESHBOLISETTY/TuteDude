import mongoose from 'mongoose';
import { sendUserUpdater } from '../middleware/ServerSentUpdates.js';

const buyerSchema = new mongoose.Schema(
    {
        username: {
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
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
        },
        phonenumber: {
            type: Number,
            required: true,
            unique: true,
            minlength: 10,
        },
        password: {
            type: String,
            required: true,
            minlength: 3, // Ensure at least 6 characters
        },
        token: {
            type: String,
        },
        image: {
            type: String,
            required: true
        },
        forgottoken: {
            type: String,
            default: null
        },
        addresses:
        {
            addressId: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String, trim: true },
            zipcode: { type: Number },
        },
        type: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            }
        ]
    },

    {
        timestamps: true,
    }
);

buyerSchema.post("save", async function (doc) {
    if (doc.email) {
        await sendUserUpdater(doc.email)
    }
});

export const Buyer = mongoose.model("Buyer", buyerSchema);