import jwt from "jsonwebtoken";
import { Buyer } from "../models/Buyer.js";
import { Seller } from "../models/Seller.js";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = async (req, res, next) => {
    try {
        // console.log("body" ,req.body.token);
        // console.log("cookies",req.cookies.token);
        //  console.log("header",req.header("Authorization"));
        // const token = req.header("Authorization").replace("Bearer ", "");
        const token = req.params.token || req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.email) {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }

        const user = await Buyer.findOne({ email: decoded.email }).select("-password") || await Seller.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ success: false, message: "Unauthorized access." });
    }
};