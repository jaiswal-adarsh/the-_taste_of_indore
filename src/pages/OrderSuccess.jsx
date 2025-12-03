import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, total } = location.state || {};

    if (!orderId) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p>No order details found.</p>
                <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-[var(--color-border)] text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">Order Confirmed!</h1>
                <p className="text-[var(--color-text-muted)] mb-6">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-[var(--color-text-muted)]">Order ID</span>
                        <span className="font-bold text-[var(--color-secondary)]">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Total Amount</span>
                        <span className="font-bold text-[var(--color-secondary)]">₹{total}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button onClick={() => navigate('/profile')} className="w-full" variant="outline">
                        View Order Details
                    </Button>
                    <Button onClick={() => navigate('/shop')} className="w-full">
                        <ShoppingBag className="mr-2" size={18} />
                        Continue Shopping
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
