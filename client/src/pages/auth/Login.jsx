import React, { use, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import ForgotPasswordModal from '../../components/popups/ForgotPasswordModal';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
const Login = () => {
    const navigate = useNavigate();
    // const { toast } = useToast();
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onForgotPassword = (e) => {
        setShowForgotPassword(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            // toast({
            //     title: "User Status",
            //     description: `Please enter both email and password.`,
            //     duration: 2000,
            // });
            return;
        }
        const response = await login(formData, navigate)
        console.log('Login data:', response);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 via-green-500 to-green-600 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-center text-white px-8">
                    <div className="mb-8">
                        <div className="w-64 h-64 mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                            <div className="absolute inset-4 bg-white/30 rounded-full flex items-center justify-center">
                                <User className="w-20 h-20 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg opacity-90">
                        Your favorite meals are just a few clicks away
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-600 to-transparent"></div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Log in</h2>
                        <p className="text-gray-600">
                            Hello friend! I'm SmartEats - task manager you can trust everything. Let's get in touch!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Let's start!
                        </button>
                    </form>


                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/auth/signup')}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            {showForgotPassword && (
                <ForgotPasswordModal
                    onClose={() => setShowForgotPassword(false)}
                    onSuccess={() => {
                        setShowForgotPassword(false);
                        navigate("/auth/login")
                    }}
                />
            )}
        </div>

    );
};

export default Login;