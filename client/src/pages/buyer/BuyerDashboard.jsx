import React from 'react'
import { calculateTotals } from '../../redux/supplier/cartSlice';
import Sidebar from '../../components/Dashboard/Layout/Sidebar';
import TopNavbar from '../../components/Dashboard/Layout/TopNavbar';
import HomePage from '../../components/Dashboard/HomePage';
import UserProfile from '../../components/Dashboard/UserProfile';
import OrderList from '../../components/Dashboard/OrderList';
import CartSidebar from '../../components/Dashboard/CartSidebar';
import VoiceModal from '../../components/Dashboard/Voice/VoiceModal';
import VoiceButton from '../../components/Dashboard/Voice/VoiceButton';
import { useState } from 'react';

const BuyerDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage />;
            case 'profile':
                return <UserProfile />;
            case 'orders':
                return <OrderList />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Hidden on desktop, visible on mobile when open */}
            <div className="lg:hidden">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <TopNavbar
                    onMenuClick={() => setSidebarOpen(true)}
                    onCartClick={() => setCartOpen(true)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
            />

            <VoiceButton />
            <VoiceModal />
        </div>
    )
}

export default BuyerDashboard