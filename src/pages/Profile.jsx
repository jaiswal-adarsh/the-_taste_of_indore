import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { MapPin, Trash2, Plus, X, AlertTriangle } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [orderToCancel, setOrderToCancel] = useState(null);
    const navigate = useNavigate();

    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        address: '',
        city: 'Indore',
        pincode: ''
    });

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

    const fetchAddresses = async () => {
        if (user?.id) {
            const addr = await authService.getAddresses(user.id);
            setAddresses(addr);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
            fetchAddresses();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (user?.id) {
            await authService.saveAddress(user.id, addressForm);
            fetchAddresses();
            setShowAddressForm(false);
            setAddressForm({ name: '', phone: '', address: '', city: 'Indore', pincode: '' });
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Delete this address?') && user?.id) {
            await authService.removeAddress(user.id, addressId);
            fetchAddresses();
        }
    };

    const initiateCancelOrder = (order) => {
        setOrderToCancel(order);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) return;

        try {
            await orderService.updateOrderStatus(orderToCancel.id, 'Cancelled', cancelReason);

            alert('Order cancelled successfully.');
            setShowCancelModal(false);
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order.');
        }
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
                        <div className="flex space-x-6 border-b border-[var(--color-border)] mb-8 overflow-x-auto">
                            {['profile', 'orders', 'addresses'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 px-2 font-medium transition-colors relative capitalize whitespace-nowrap ${activeTab === tab ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]'}`}
                                >
                                    {tab === 'profile' ? 'Profile Details' : tab === 'orders' ? 'Order History' : 'Saved Addresses'}
                                    {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />}
                                </button>
                            ))}
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
                                                <div key={order.id} className="bg-white p-4 rounded-xl border border-[var(--color-border)] hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-4">
                                                    <div>
                                                        <div className="font-bold text-[var(--color-secondary)]">{order.id}</div>
                                                        <div className="text-sm text-[var(--color-text-muted)]">{order.date} • {order.items} Items</div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                        'bg-blue-100 text-blue-700'}`}>
                                                            {order.status}
                                                        </span>
                                                        <span className="font-bold">₹{order.total}</span>
                                                        <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>View</Button>
                                                        {order.status === 'Pending' && (
                                                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => initiateCancelOrder(order)}>
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </div>
                                                    {order.cancellationReason && (
                                                        <div className="w-full mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                                            <strong>Reason:</strong> {order.cancellationReason}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'addresses' && (
                                <motion.div
                                    key="addresses"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-[var(--color-secondary)]">Saved Addresses</h2>
                                        <Button size="sm" onClick={() => setShowAddressForm(true)}>
                                            <Plus size={16} className="mr-2" /> Add New
                                        </Button>
                                    </div>

                                    {showAddressForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-gray-50 p-6 rounded-xl border border-[var(--color-border)] mb-6"
                                        >
                                            <h3 className="font-bold mb-4">Add New Address</h3>
                                            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Full Name"
                                                    value={addressForm.name}
                                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                                    required
                                                />
                                                <Input
                                                    label="Phone"
                                                    value={addressForm.phone}
                                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                    required
                                                />
                                                <Input
                                                    label="Address"
                                                    className="md:col-span-2"
                                                    value={addressForm.address}
                                                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                                    required
                                                />
                                                <Input
                                                    label="City"
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    required
                                                />
                                                <Input
                                                    label="Pincode"
                                                    value={addressForm.pincode}
                                                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                                    required
                                                />
                                                <div className="md:col-span-2 flex gap-2">
                                                    <Button type="submit">Save Address</Button>
                                                    <Button type="button" variant="ghost" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr, index) => (
                                            <div key={index} className="p-4 border border-[var(--color-border)] rounded-xl flex justify-between items-start hover:shadow-sm transition-shadow">
                                                <div className="flex items-start">
                                                    <MapPin className="text-[var(--color-primary)] mr-3 mt-1" size={20} />
                                                    <div>
                                                        <div className="font-bold">{addr.name}</div>
                                                        <div className="text-sm text-gray-600">{addr.address}</div>
                                                        <div className="text-sm text-gray-600">{addr.city} - {addr.pincode}</div>
                                                        <div className="text-sm text-gray-500 mt-1">{addr.phone}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="text-red-400 hover:text-red-600 p-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        {addresses.length === 0 && !showAddressForm && (
                                            <div className="col-span-2 text-center py-8 text-[var(--color-text-muted)]">
                                                No saved addresses. Add one to speed up checkout.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

            {/* Cancel Order Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative"
                        >
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                            <div className="flex items-center mb-4 text-red-600">
                                <AlertTriangle className="mr-2" />
                                <h3 className="text-xl font-bold">Cancel Order</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to cancel Order #{orderToCancel?.id}?
                            </p>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Cancellation <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    rows={3}
                                    placeholder="Please tell us why..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                    onClick={handleCancelOrder}
                                    disabled={!cancelReason}
                                >
                                    Confirm Cancellation
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant="outline"
                                    onClick={() => setShowCancelModal(false)}
                                >
                                    Keep Order
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
