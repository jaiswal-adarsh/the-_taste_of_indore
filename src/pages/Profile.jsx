import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Button from '../components/Button';
import Input from '../components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';

const Profile = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const allOrders = await orderService.getAllOrders();
            // Filter by name or email for better matching
            const userOrders = allOrders.filter(o =>
                o.customer === user.name ||
                (o.email && o.email === user.email)
            );
            setOrders(userOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                    <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-primary)] text-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="opacity-90">{user.email}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>

                    <div className="p-8">
                        <div className="flex space-x-6 border-b border-[var(--color-border)] mb-8">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'profile' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]'}`}
                            >
                                Profile Details
                                {activeTab === 'profile' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'orders' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]'}`}
                            >
                                Order History
                                {activeTab === 'orders' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6 max-w-md"
                                >
                                    <h2 className="text-xl font-bold text-[var(--color-secondary)]">Personal Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Full Name</label>
                                            <Input value={user.name} readOnly />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email Address</label>
                                            <Input value={user.email} readOnly />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Role</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 capitalize text-gray-700">
                                                {user.role}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-[var(--color-secondary)]">Order History</h2>
                                        <Button size="sm" variant="ghost" onClick={fetchOrders}>Refresh</Button>
                                    </div>
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-[var(--color-text-muted)]">No orders found.</p>
                                            <Button className="mt-4" onClick={() => navigate('/shop')}>Start Shopping</Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map(order => (
                                                <div key={order.id} className="bg-white p-4 rounded-xl border border-[var(--color-border)] hover:shadow-md transition-shadow flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold text-[var(--color-secondary)]">{order.id}</div>
                                                        <div className="text-sm text-[var(--color-text-muted)]">{order.date} • {order.items} Items</div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-blue-100 text-blue-700'}`}>
                                                            {order.status}
                                                        </span>
                                                        <span className="font-bold">₹{order.total}</span>
                                                        <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>View</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
    );
};

export default Profile;
