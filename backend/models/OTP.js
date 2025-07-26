import mongoose from "mongoose";
// import mailSender from "../utils/mailSender.js";
// import emailVerificationTemplate from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60 * 60, // OTP expires in 5 minutes
    }
});

// Function to send verification email
// const sendVerificationEmail = async (email, otp) => {
//     try {
//         const mailResponse = await mailSender(
//             email,
//             "Verification email sent by Crop Circuits",
//             emailVerificationTemplate(otp)
//         );
//         console.log("Email sent successfully:", mailResponse.response);
//     } catch (error) {
//         console.error("Error occurred while sending mail:", error);
//         throw error;
//     }
// };

// Middleware to send verification email on OTP creation
// otpSchema.pre("save", async function (next) {
//     console.log("Verification mail for OTP:");
//     if (this.isNew) {
//         await sendVerificationEmail(this.email, this.otp);
//     }
//     next();
// });

export const OTP = mongoose.model("OTP", otpSchema);
