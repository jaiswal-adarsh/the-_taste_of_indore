import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Button from '../components/Button';
import Input from '../components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [showUpiModal, setShowUpiModal] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: 'Indore',
        pincode: '',
        phone: ''
    });

    if (cart.length === 0) {
        // navigate('/shop'); // Causing render loop if called directly in body
        // return null;
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (paymentMethod === 'upi') {
            setShowUpiModal(true);
        } else {
            processOrder();
        }
    };

    const processOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                customer: user?.name || formData.name,
                email: user?.email || formData.email,
                total: total,
                items: cart.length,
                cartItems: cart, // Save full cart details if needed
                shippingAddress: formData,
                paymentMethod: paymentMethod
            };

            await orderService.createOrder(orderData);

            clearCart();
            alert('Order Placed Successfully!');
            navigate('/');
        } catch (error) {
            console.error('Order placement failed:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpiPayment = () => {
        window.open('upi://pay?pa=merchant@upi&pn=TheTasteOfIndore&am=' + total + '&cu=INR', '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Step 1: Shipping Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] mb-6"
                    >
                        <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-4">Shipping Information</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                id="name"
                                label="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                id="phone"
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                id="address"
                                label="Address"
                                className="md:col-span-2"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                id="city"
                                label="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                id="pincode"
                                label="Pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                required
                            />
                        </form>
                    </motion.div>

                    {/* Step 2: Payment Method */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]"
                    >
                        <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-4">Payment Method</h2>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[var(--color-primary)] bg-orange-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                    className="mr-3 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                />
                                <span className="font-medium">Cash on Delivery (COD)</span>
                            </label>

                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-[var(--color-primary)] bg-orange-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="upi"
                                    checked={paymentMethod === 'upi'}
                                    onChange={() => setPaymentMethod('upi')}
                                    className="mr-3 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                />
                                <span className="font-medium">UPI (Google Pay / PhonePe)</span>
                            </label>
                        </div>
                    </motion.div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] sticky top-24">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-6">Order Summary</h3>

                        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                            <div className="flex justify-between text-[var(--color-text-muted)]">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-[var(--color-text-muted)]">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-[var(--color-secondary)] pt-2">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePlaceOrder}
                            isLoading={loading}
                        >
                            Place Order
                        </Button>
                    </div>
                </div>
            </div>

            {/* UPI Payment Modal */}
            <AnimatePresence>
                {showUpiModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative"
                        >
                            <button
                                onClick={() => setShowUpiModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">Complete Payment</h3>
                            <p className="text-[var(--color-text-muted)] mb-6">
                                Please complete the payment of <strong>₹{total}</strong> using your preferred UPI app.
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleUpiPayment}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    1. Open Payment App
                                </Button>

                                <Button
                                    onClick={() => { setShowUpiModal(false); processOrder(); }}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    2. I Have Paid
                                </Button>

                                <Button
                                    onClick={() => setShowUpiModal(false)}
                                    variant="outline"
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    3. Cancel Order
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;
