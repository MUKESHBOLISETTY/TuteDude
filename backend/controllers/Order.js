


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