
import { Buyer } from '../models/Buyer.js';
import { Order } from '../models/Order.js';
import uniqid from 'uniqid';
import errorHandler from '../utils/errorHandler.js';
import { Seller } from '../models/Seller.js';

const orderClients = new Set();

export const createOrder = async (req, res) => {
    try {
        console.log(req.body)
        const { delivery, sellerId, orderlist, subtotal, totalprice, deliveryStatus, status } = req.body;

        if (!delivery.address || !sellerId || !orderlist || !delivery.distance || !delivery.deliveryfee || !delivery.paymentmethod || !deliveryStatus) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        const user = await Buyer.findOne({ email: req.user.email });
        console.log("User:", sellerId);
        const findSeller = await Seller.findById(sellerId);
        if (!findSeller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            });
        } console.log("Find Seller:", findSeller);
        const order = await Order.create({
            orderId: uniqid(),
            customer: {
                customerName: user.username,
                customerId: user._id,
                customerEmail: user.email,
                customerPhoneNumber: user.phonenumber
            },
            delivery: {
                address: delivery.address,
                distance: delivery.distance,
                deliveryfee: delivery.deliveryfee,
                sellerId: findSeller._id,
                deliveredOn: delivery.deliveredOn,
                paymentmethod: delivery.paymentmethod
            },
            items: orderlist,
            subtotal,
            totalprice,
            status,
            deliveryStatus,

        })
        const u = await Buyer.findByIdAndUpdate(user._id, { $push: { orders: order._id } });
        await u.save()
        return res.status(200).json({
            success: true,
            message: 'order-created'
        });
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

export const deleteOrder = async (req, res) => {
    try {
        if (req.user.type !== "admin") {
            return errorHandler(res)
        }
        const { orderId, userId } = req.body;
        if (!orderId || !userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        await Buyer.findByIdAndUpdate(userId, { $pull: { orders: orderId } });

        return res.status(200).json({
            success: true,
            message: 'order-deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Occured"
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status, deliveryStatus } = req.body;
        console.log("Req.body;", req.body)
        if (!orderId || (!status && !deliveryStatus)) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (status) order.status = status;
        if (deliveryStatus) order.deliveryStatus = deliveryStatus;

        await order.save();


        return res.status(200).json({
            success: true,
            message: 'order-status-updated'
        });

    } catch (error) {
        return errorHandler(res)
    }
}

export const updateDeliveryAgent = async (req, res) => {
    try {
        if (req.user.type === "deliveryagent" || req.user.type === "admin") {
            const { orderId, deliveryagentId } = req.body;
            if (!orderId || !deliveryagentId) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                })
            }
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found." });
            }
            const deliveryAgent = await Buyer.findById(deliveryagentId)
            if (!deliveryAgent) {
                return res.status(404).json({ success: false, message: "Delivery Agent not found." });
            }
            if (deliveryAgent.type == "deliveryagent") {
                order.deliveryagentId = deliveryagentId;
                await order.save();

                return res.status(200).json({
                    success: true,
                    message: 'delivery-agent-updated'
                });

            } else {
                return errorHandler(res)
            }
        } else {
            return errorHandler(res)
        }
    } catch (error) {
        return errorHandler(res)
    }
}
// ORDERS SSE STREAM
export const getOrdersData = async () => {
    try {
        const orders = await Order.find()
        if (!orders) {
            throw new Error("No Orders Found");
        } else {
            return orders
        }
    } catch (error) {
        throw new Error(`Failed to retrieve orders data`);
    }
}
export const getOrders = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        if (req.user.type == "normal") {
            res.write(`event: restricted\n`);
            res.write(`data: ${JSON.stringify({ message: 'Failed to retrieve initial order data.', code: 'USER_RESTRICTED' })}\n\n`);
            res.end();
        }
        const initialData = await getOrdersData();
        res.write(`event: initial_data\n`);
        orderClients.add(res);
        res.write(`data: ${JSON.stringify(initialData)}\n\n`);
        console.log(`SSE client for orders has been connected. Sent initial data.`);

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: 'Failed to establish SSE connection.' });
        } else {
            res.write(`event: error\n`);
            res.write(`data: ${JSON.stringify({ message: 'Failed to retrieve initial order data.', code: 'INITIAL_DATA_ERROR' })}\n\n`);
            res.end();
        }
    }
}
export const sendOrdersUpdate = async () => {
    for (const client of orderClients) {
        try {
            const updateOrders = await getOrdersData();
            client.write(`event: orders_update\n`);
            client.write(`data: ${JSON.stringify(updateOrders)}\n\n`);
            console.log(`Sent updated orders data`);
        } catch (err) {
            console.error("Failed to send SSE to a client. Removing.");
            client.write(`event: error\n`);
            client.write(`data: ${JSON.stringify({ message: 'Failed to retrieve user data.', code: 'SEND_UPDATE_ERROR' })}\n\n`);
            orderClients.delete(client);
        }
    }
}
