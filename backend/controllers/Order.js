import { User } from '../model/User.js';
import { Order } from '../model/Order.js';
import uniqid from 'uniqid';
import errorHandler from '../utils/errorHandler.js';

const orderClients = new Set();

export const createOrder = async (req, res) => {
    try {
        const { delivery, orderlist, subtotal, totalprice } = req.body;
        if (!delivery.address || !orderlist || !delivery.distance || !delivery.deliveryfee || !delivery.paymentmethod) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        const user = await User.findOne({ email: req.user.email })
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
                paymentmethod: delivery.paymentmethod
            },
            items: orderlist,
            subtotal,
            totalprice,
            status: "pending",

        })
        const u = await User.findByIdAndUpdate(user._id, { $push: { orders: order._id } });
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
        await User.findByIdAndUpdate(userId, { $pull: { orders: orderId } });

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
        if (req.user.type === "deliveryagent" || req.user.type === "admin") {
            const { orderId, status } = req.body;
            if (!orderId || !status) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                })
            }
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found." });
            }
            order.status = status;
            await order.save();

            return res.status(200).json({
                success: true,
                message: 'order-status-updated'
            });
        } else {
            return errorHandler(res)
        }
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
            const deliveryAgent = await User.findById(deliveryagentId)
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
const getOrdersData = async () => {
    try {
        const orders = await Order.find().populate({ path: 'delivery.deliveryagentId' })
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
