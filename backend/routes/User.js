import express from "express";
import { login, signup, verifyOtp, resendOtp, updateUser, changePassword, sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPassword, deleteUser } from '../controllers/Auth.js'
import { getUser } from '../middleware/ServerSentUpdates.js'
import { rateLimit } from 'express-rate-limit'
import { authenticateUser } from '../middleware/AuthMiddleware.js'
import { AiFinder } from "../controllers/AiFinder.js";
// import { addAddress, deleteAddress, updateAddress } from "../controllers/AddressManagement.js";
const router = express.Router();
// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

})
//Route for user login
router.post("/login", limiter, login);

// Route for user signup
router.post("/signup", limiter, signup);

// // Route for verifying OTP
router.post("/verifyOtp", limiter, verifyOtp);

// Route for resending OTP
router.post("/resendOtp", limiter, resendOtp);

// Route for forgot password
router.post("/sendForgotPasswordOtp", limiter, sendForgotPasswordOtp);

// Route for verify forgot password
router.post("/verifyForgotPasswordOtp", limiter, verifyForgotPasswordOtp);

// Route for reset password
router.post("/resetPassword", limiter, resetPassword);

router.delete("/deleteUser", limiter, authenticateUser, deleteUser)

router.get("/getUser/:token/:email", authenticateUser, getUser);

router.put("/updateUser", limiter, authenticateUser, updateUser);

router.post("/changePassword", authenticateUser, changePassword);

router.post("/aifinder", authenticateUser, AiFinder);

export default router;