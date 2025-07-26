import React, { useState, useEffect } from 'react';
import { Mail, Clock, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
const VerifyOTP = () => {
    const navigate = useNavigate()
    const { email } = useParams();
    const { verifyOtp } = useAuth()
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleInputChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length === 6) {
            await verifyOtp(email, otpString, navigate)
        }
    };

    const handleResend = () => {
        setTimeLeft(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        console.log('OTP resent to:', email);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-center text-white px-8">
                    <div className="mb-8">
                        <div className="w-64 h-64 mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                            <div className="absolute inset-4 bg-white/30 rounded-full flex items-center justify-center">
                                <Mail className="w-20 h-20 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Check Your Email</h1>
                    <p className="text-lg opacity-90">
                        We've sent a verification code to secure your account
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600 to-transparent"></div>
            </div>

            {/* Right side - OTP Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                        <p className="text-gray-600 mb-2">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-purple-600 font-medium">{email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter verification code
                            </label>
                            <div className="flex justify-center space-x-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-lg font-bold bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            {!canResend ? (
                                <div className="flex items-center justify-center text-gray-500 text-sm">
                                    <Clock className="w-4 h-4 mr-1" />
                                    Resend code in {timeLeft}s
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="flex items-center justify-center text-purple-600 hover:text-purple-700 text-sm font-medium mx-auto"
                                >
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Resend code
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={otp.join('').length !== 6}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Verify Code
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button
                                onClick={() => navigate('/auth/login')}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Back to login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;