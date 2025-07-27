import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/supplier/cartSlice';
import toast from 'react-hot-toast';
import useOrders from '../../hooks/useOrders';

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createOrder } = useOrders();
  const { items, total, itemCount } = useSelector((state) => state.cart);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: '',
    distance: 1,
    deliveryfee: 0,
    paymentmethod: 'payondelivery'
  });

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleDeliveryDetailsChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    const checkoutData = {
      delivery: {
        ...deliveryDetails,
        deliveryfee: deliveryDetails.distance * 10
      },
      sellerId: items[0].sellerId,
      orderlist: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        sellerId: item.sellerId
      })),
      subtotal: total,
      totalprice: total + (total * 0.18),
      deliveryStatus: "confirmed",
      status: "processing"
    };

    if (!checkoutData.delivery.address ||
      !checkoutData.orderlist.length ||
      !checkoutData.delivery.distance ||
      !checkoutData.delivery.deliveryfee ||
      !checkoutData.delivery.paymentmethod ||
      !checkoutData.deliveryStatus) {
      toast.error('Please fill all required fields', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }

    try {
      const response = await createOrder(checkoutData);
      if (response.data.message === 'order-created') {
        dispatch(clearCart());
        toast.success('Order Created', { duration: 2000 })
        onClose();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const deliveryForm = (
    <div className="space-y-3 mb-4">
      <input
        type="text"
        name="address"
        value={deliveryDetails.address}
        onChange={handleDeliveryDetailsChange}
        placeholder="Delivery Address"
        className="w-full p-2 border rounded text-sm"
      />
      <select
        name="paymentmethod"
        value={deliveryDetails.paymentmethod}
        onChange={handleDeliveryDetailsChange}
        className="w-full p-2 border rounded text-sm"
      >
        <option value="payondelivery">Cash on Delivery</option>
        <option value="upi">Online Payment</option>
      </select>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="fixed right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold">Shopping Cart ({itemCount})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">Your cart is empty</div>
              <div className="text-sm text-gray-400">Add some products to get started</div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">₹{item.price} per {item.unit}</p>
                    <p className="text-xs sm:text-sm text-gray-500">by {item.sellerName}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-green-600 text-sm">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {deliveryForm}
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-semibold">Total:</span>
              <span className="text-lg sm:text-xl font-bold text-green-600">
                ₹{(total + (deliveryDetails.distance * 10)).toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartSidebar;
