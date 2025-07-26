import { Buyer } from '../model/Buyer.js';
import { Seller } from '../model/Seller.js';
import { Order } from '../model/Order.js';
import { OTP } from '../model/OTP.js'
import { ForgotPassword } from '../model/ForgotPassword.js';
import bcrypt from "bcrypt";
import otpGenerator from 'otp-generator';
import uniqid from 'uniqid';
import jwt from "jsonwebtoken";
import errorHandler from '../utils/errorHandler.js';
import { respond } from '../utils/respond.js';

const clients = new Map();

// import { mailSender } from '../utils/mailSender.js';
// import { otpTemplate } from '../mail/emailVerificationTemplate.js';
const tokenGenerator = async (email) => {
    const uid = uniqid()
    const payload = {
        email,
        uid
    };
    const newtoken = jwt.sign(payload, process.env.JWT_SECRET);
    return newtoken;
}


const sendOtp = async (email) => {
    try {
        const checkUserPresent = await Buyer.findOne({ email }) || await Seller.findOne({ email });
        if (checkUserPresent) {
            const otpConfig = {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true
            };
            let otp = otpGenerator.generate(6, otpConfig);

            //check unique otp or not
            let result = await OTP.findOne({ otp: otp });
            while (result) {
                otp = otpGenerator.generate(6, otpConfig);
                //check unique otp or not
                result = await OTP.findOne({ otp: otp });
            }

            const otpPayload = { email, otp };
            console.log(otpPayload)
            const otpBody = await OTP.create(otpPayload);
            //await mailSender(email, "Verification email send by Event Sphere", otpTemplate(otp));
            return otp;
        } else {
            return 'Error Occured'
        }

    } catch (error) {
        console.log("ERROR IN AUTH : ", error);
        return error.message
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        const UserSchema = await Buyer.findOne({ email }).select("email token password") || await Seller.findOne({ email }).select("email token password")
        if (!UserSchema) {
            return res.status(400).json({
                success: false,
                message: "Invalid User Details!",
            });
        } else {
            if (await bcrypt.compare(password, UserSchema.password)) {
                return res.status(200).json({
                    success: true,
                    message: "userlogin",
                    UserSchema
                });

            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid User Details!",
                });
            }
        }
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

export const signup = async (req, res) => {
    try {
        const { username, email, phonenumber, password, confirmPassword, imageUrl, type } = req.body;
        if (!username || !phonenumber || !email || !password || !confirmPassword || !type) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm Password fields are not same, please try again",
            })
        }
        const existingUsers = await Buyer.findOne({ email }) || await Seller.findOne({ email });
        if (existingUsers) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const freshtoken = await tokenGenerator(email)
        const phone = parseInt(phonenumber);
        if (type == 'seller') {
            await Seller.create({
                token: freshtoken, username, email, phonenumber: phone, password: hashedPassword, type: 'Seller', image: imageUrl ? imageUrl : `http://api.dicebear.com/5.x/initials/svg?seed=${username}`, verified: false
            })
        } else if (type == 'buyer') {
            await Buyer.create({
                token: freshtoken, username, email, phonenumber: phone, password: hashedPassword, type: 'Buyer', image: imageUrl ? imageUrl : `http://api.dicebear.com/5.x/initials/svg?seed=${username}`, verified: false
            })
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        //validate otp
        if (recentOtp.length == 0) {
            const otp = await sendOtp(email);
            if (!otp || typeof otp !== 'string' || otp.includes("Error")) {
                return errorHandler(res)
            }
        }

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again"
        })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Mail is required"
            });
        }
        if (!otp || otp.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Otp is required"
            });
        }
        const checkUserPresent = await Buyer.findOne({ email }) || await Seller.findOne({ email });
        if (checkUserPresent) {
            const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
            if (recentOtp.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP"
                });
            } else if (recentOtp[0].otp == otp) {
                const user = await Buyer.findOne({ email }) || await Seller.findOne({ email });
                if (user) {
                    user.verified = true;
                    await user.save();
                    await OTP.deleteOne({ email });
                    return res.status(200).json({
                        success: true,
                        message: "otpverified"
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP"
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid User"
            });
        }
    } catch (error) {
        return errorHandler(res)
    }
}

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Mail is required"
            });
        }
        const checkUserPresent = await Buyer.findOne({ email }) || await Seller.findOne({ email });;
        if (checkUserPresent) {
            if (!checkUserPresent.verified) {
                const otp = await sendOtp(email);
                if (otp.includes("Error")) {
                    return res.status(400).json({
                        success: false,
                        message: "Error Occured"
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: "otpsent"
                    });
                }
            }
            else {
                return res.status(500).json({
                    success: false,
                    message: "Error Occured"
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid User"
            });
        }
    } catch (error) {
        return errorHandler(res)
    }
}

export const getUserData = async (email) => {
    try {
        const user = await Buyer.findOne({ email, verified: true }).select("-password -token -forgottoken").populate({ path: 'orders', }) || await Seller.findOne({ email, verified: true }).select("-password -token -forgottoken").populate({ path: 'products' })
        if (user?.verified !== true || !user) {
            throw new Error("User not found");
        } else {
            return user
        }
    } catch (error) {
        throw new Error(`Failed to retrieve user data`);
    }
}


export const sendForgotPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Mail is required"
            });
        }
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            const otpConfig = {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true
            };
            let otp = otpGenerator.generate(6, otpConfig);
            //check unique otp or not
            let result = await ForgotPassword.findOne({ otp: otp });
            while (result) {
                otp = otpGenerator.generate(6, otpConfig);
                //check unique otp or not
                result = await ForgotPassword.findOne({ otp: otp });
            }

            const otpPayload = { email, otp };
            console.log(otpPayload)
            const otpBody = await ForgotPassword.create(otpPayload);
            console.log("OTP body : ", otpBody);
            //await mailSender(email, "Forgot Password verification email send by Event Sphere", otpTemplate(otp));
            return res.status(200).json({
                success: true,
                message: "otpsent"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid User"
            });
        }
    } catch (error) {
        return errorHandler(res)
    }
}

export const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Mail is required"
            });
        }
        if (!otp || otp.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Otp is required"
            });
        }
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            const recentOtp = await ForgotPassword.find({ email }).sort({ createdAt: -1 }).limit(1);
            if (recentOtp.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP"
                });
            } else if (recentOtp[0].otp == otp) {
                const user = await User.findOne({ email });
                const uniqueid = uniqid();
                user.forgottoken = uniqueid;
                await user.save();

                // Delete token after 3 minutes (180,000 milliseconds)
                setTimeout(async () => {
                    user.forgottoken = null;
                    await user.save();
                }, 180000);
                return res.status(200).json({
                    success: true,
                    message: "otpverified",
                    uniqueid
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid User"
            });
        }
    } catch (error) {
        return errorHandler(res)
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, token, confirmPassword } = req.body;

        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Mail is required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid User"
            });
        }
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong"
            });
        }
        if (!newPassword || newPassword.trim() === '' || !confirmPassword || confirmPassword.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }
        if (user.forgottoken !== token) {
            return res.status(401).json({
                success: false,
                message: "Invalid User"
            });
        }

        // if (!(await bcrypt.compare(currentPassword, user.password))) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Old Password Incorrect"
        //     });
        // }


        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const newtoken = await tokenGenerator(email)
        user.password = hashedPassword;
        user.token = newtoken;
        if (newtoken) user.forgottoken = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "passwordchanged"
        });
    } catch (error) {
        return errorHandler(res)
    }
}

export const updateUser = async (req, res) => {
    try {
        const { username, phonenumber } = req.body;

        if (!username && !phonenumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid User"
            });
        }
        if (username && phonenumber) {

            if (user.username == username && user.phonenumber == phonenumber) {
                return respond(res, "userupdated", 200, true);
            }
        }
        if (username) {
            if (username.length < 3 || username.length > 14) {
                return res.status(400).json({
                    success: false,
                    message: "Username must be between 3-14 characters"
                });
            }

            user.username = username;
            await user.save();
        }
        if (phonenumber) {
            if (phonenumber.length < 10 || phonenumber.length > 10) {
                return res.status(400).json({
                    success: false,
                    message: "Phone Number must be valid"
                });
            }

            user.phonenumber = phonenumber;
            await user.save();
        }

        return respond(res, "userupdated", 200, true);

    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid User"
            });
        }
        if (!newPassword || newPassword.trim() === '' || !confirmPassword || confirmPassword.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New Password and Confirm Password are not same."
            });
        }

        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Old Password Incorrect"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const newtoken = await tokenGenerator(req.user.email);
        user.password = hashedPassword;
        user.token = newtoken;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "passwordchanged"
        });
    } catch (error) {
        return errorHandler(res)
    }
}

export const deleteUser = async (req, res) => {
    try {
        if (req.user.type !== "admin") {
            return errorHandler(res)
        }

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        await findUser.deleteOne()

        return res.status(200).json({
            success: true,
            message: "user-deleted"
        })

    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}
