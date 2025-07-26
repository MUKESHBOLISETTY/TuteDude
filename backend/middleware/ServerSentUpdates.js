import { getUserData } from "../controllers/Auth";

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
        }
        res.write(`event: initial_user_data\n`);
        res.write(`data: ${JSON.stringify(initialUserData)}\n\n`);
        console.log(`SSE client for ${email} connected. Sent initial user data.`);

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