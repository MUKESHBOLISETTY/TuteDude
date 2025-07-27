import { getUserData } from "../controllers/Auth.js";
import { getProductsData } from "../controllers/Product.js";

export const Clients = new Set();
export const user = new Map();
export const getUser = async (req, res) => {
    try {
        const email = req.params.email;
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const initialUserData = await getUserData(email);
        if (initialUserData) {
            user.set(email, res)
            res.write(`event: initial_user_data\n`);
            res.write(`data: ${JSON.stringify(initialUserData)}\n\n`);
            console.log(`SSE client for ${email} connected. Sent initial user data.`);
        }


    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: 'Failed to establish SSE connection.' });
        } else {
            res.write(`event: error\n`);
            res.write(`data: ${JSON.stringify({ message: 'Failed to retrieve initial user data.', code: 'INITIAL_DATA_ERROR' })}\n\n`);
            res.end();
        }
    }
}

export const sendUserUpdater = async (email) => {
    try {
        const res = user.get(email);
        if (res) {
            const updatedUser = await getUserData(email);
            res.write(`event: user_update\n`);
            res.write(`data: ${JSON.stringify(updatedUser)}\n\n`);
            console.log(`Sent updated data to ${email}`);
        }
    } catch (error) {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ message: 'Failed to retrieve user data.', code: 'SEND_UPDATE_ERROR' })}\n\n`);
        res.end();
    }
}

export const getProducts = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // if (req.user.type == "Seller") {
        //     res.write(`event: restricted\n`);
        //     res.write(`data: ${JSON.stringify({ message: 'Failed to retrieve initial product data.', code: 'USER_RESTRICTED' })}\n\n`);
        //     res.end();
        // }

        const initialProductData = await getProductsData();
        Clients.add(res);
        res.write(`event: initial_product_data\n`);
        res.write(`data: ${JSON.stringify(initialProductData)}\n\n`);
        console.log(`SSE client for connected. Sent initial product data.`);

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

export const sendProductsUpdater = async () => {
    for (const client of Clients) {
        try {
            const updateProducts = await getProductsData();
            client.write(`event: products_update\n`);
            client.write(`data: ${JSON.stringify(updateProducts)}\n\n`);
            console.log(`Sent updated products data`);
        } catch (err) {
            console.error("Failed to send SSE to a client. Removing.");
            client.write(`event: error\n`);
            client.write(`data: ${JSON.stringify({ message: 'Failed to retrieve products data.', code: 'SEND_UPDATE_ERROR' })}\n\n`);
            Clients.delete(client);
        }
    }
}