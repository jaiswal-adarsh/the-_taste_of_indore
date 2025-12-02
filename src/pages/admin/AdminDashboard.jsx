import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { categoryService, bannerService, contentService } from '../../services/adminServices';
import { authService } from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Edit, Trash2, Layers, Image as ImageIcon, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [aboutContent, setAboutContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Form States
    const [newCategory, setNewCategory] = useState('');
    const [newBanner, setNewBanner] = useState('');

    // Product Management States
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Namkeen',
        image: '',
        inStock: true
    });

    // User Management States
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'customer' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('AdminDashboard: Fetching data...');
            const [p, o, u, c, b, a] = await Promise.all([
                productService.getAllProducts(),
                orderService.getAllOrders(),
                authService.getAllUsers(),
                categoryService.getAll(),
                bannerService.getAll(),
                contentService.getAbout()
            ]);
            console.log('AdminDashboard: Orders fetched:', o);
            setProducts(p);
            setOrders(o);
            setUsers(u);
            setCategories(c);
            setBanners(b);
            setAboutContent(a);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Product Handlers
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...productForm,
                price: Number(productForm.price),
                rating: editingProduct ? editingProduct.rating : 0,
                reviews: editingProduct ? editingProduct.reviews : 0
            };

            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, productData);
                alert('Product updated successfully');
            } else {
                await productService.addProduct(productData);
                alert('Product added successfully');
            }
            setShowProductModal(false);
            setEditingProduct(null);
            setProductForm({ name: '', description: '', price: '', category: 'Namkeen', image: '', inStock: true });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to save product');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            inStock: product.inStock
        });
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await productService.deleteProduct(productId);
            fetchData();
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return;
        const added = await categoryService.add({ name: newCategory, description: '' });
        setCategories([...categories, added]);
        setNewCategory('');
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();
        if (!newBanner) return;
        const added = await bannerService.add({ title: 'New Banner', image: newBanner, active: true });
        setBanners([...banners, added]);
        setNewBanner('');
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Delete this category?')) {
            await categoryService.delete(id);
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleDeleteBanner = async (id) => {
        if (window.confirm('Delete this banner?')) {
            await bannerService.delete(id);
            setBanners(banners.filter(b => b.id !== id));
        }
    };

    const handleUpdateContent = async () => {
        await contentService.updateAbout(aboutContent);
        alert('Content updated successfully!');
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        await orderService.updateOrderStatus(orderId, newStatus);
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);
    };

    // User Management Handlers
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await authService.updateUser(editingUser.id, userForm);
                alert('User updated successfully');
            } else {
                await authService.addUser(userForm);
                alert('User created successfully');
            }
            setShowUserModal(false);
            setEditingUser(null);
            setUserForm({ name: '', email: '', password: '', role: 'customer' });
            fetchData(); // Refresh list
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserForm({ name: user.name, email: user.email, password: user.password, role: user.role });
        setShowUserModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await authService.deleteUser(userId);
            fetchData();
        }
    };

    const handleCreateTestOrder = async () => {
        const testOrder = {
            customer: 'Test Admin Order',
            email: 'admin@test.com',
            total: 999,
            items: 1,
            cartItems: [{ id: 'test-1', name: 'Test Item', price: 999, quantity: 1 }],
            shippingAddress: { name: 'Admin Tester', address: 'Test Lab', city: 'Debug City', pincode: '000000', phone: '9999999999' },
            paymentMethod: 'cod'
        };
        await orderService.createOrder(testOrder);
        alert('Test Order Created! Refreshing...');
        fetchData();
    };

    const renderProducts = () => (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-secondary)]">Products</h2>
                <Button size="sm" onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ name: '', description: '', price: '', category: 'Namkeen', image: '', inStock: true });
                    setShowProductModal(true);
                }}>
                    <Plus size={16} className="mr-2" />
                    Add Product
                </Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                        <tr>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Product</th>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Category</th>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Price</th>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Stock</th>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                                <td className="p-4 flex items-center">
                                    <img src={product.image} alt="" className="w-10 h-10 rounded object-cover mr-3" />
                                    <span className="font-medium">{product.name}</span>
                                </td>
                                <td className="p-4 text-[var(--color-text-muted)]">{product.category}</td>
                                <td className="p-4 font-medium">₹{product.price}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditProduct(product)} className="p-1 hover:text-[var(--color-primary)]"><Edit size={18} /></button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="p-1 hover:text-[var(--color-danger)]"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSidebar = () => (
        <div className="w-64 bg-white border-r border-[var(--color-border)] min-h-[calc(100vh-64px)] p-4">
            <div className="space-y-2">
                {[
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                    { id: 'products', icon: Package, label: 'Products' },
                    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
                    { id: 'users', icon: Users, label: 'Users' },
                    { id: 'categories', icon: Layers, label: 'Categories' },
                    { id: 'banners', icon: ImageIcon, label: 'Banners' },
                    { id: 'content', icon: FileText, label: 'Content' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-gray-100 text-[var(--color-secondary)]'}`}
                    >
                        <item.icon size={20} className="mr-3" />
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                    <div className="text-[var(--color-text-muted)] mb-2">Total Sales</div>
                    <div className="text-3xl font-bold text-[var(--color-primary)]">
                        ₹{orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0).toLocaleString()}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                    <div className="text-[var(--color-text-muted)] mb-2">Total Orders</div>
                    <div className="text-3xl font-bold text-[var(--color-secondary)]">{orders.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                    <div className="text-[var(--color-text-muted)] mb-2">Total Products</div>
                    <div className="text-3xl font-bold text-[var(--color-secondary)]">{products.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                    <div className="text-[var(--color-text-muted)] mb-2">Active Users</div>
                    <div className="text-3xl font-bold text-[var(--color-secondary)]">{users.length}</div>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => {
        const rawOrders = localStorage.getItem('toi_orders');
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-secondary)]">Orders</h2>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleCreateTestOrder}>
                            Create Test Order
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                            setLoading(true);
                            fetchData();
                        }}>
                            Refresh Orders
                        </Button>
                    </div>
                </div>



                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                            <tr>
                                <th className="p-4 font-medium text-[var(--color-text-muted)]">Order ID</th>
                                <th className="p-4 font-medium text-[var(--color-text-muted)]">Customer</th>
                                <th className="p-4 font-medium text-[var(--color-text-muted)]">Date</th>
                                <th className="p-4 font-medium text-[var(--color-text-muted)]">Total</th>
                                <th className="p-4 font-medium text-[var(--color-text-muted)]">Status</th>
                                <th className="p-4 font-medium text-[var(--color-text-muted)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-[var(--color-text-muted)]">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                                        <td className="p-4 font-medium">{order.id}</td>
                                        <td className="p-4">{order.customer}</td>
                                        <td className="p-4 text-[var(--color-text-muted)]">{order.date}</td>
                                        <td className="p-4 font-medium">₹{order.total}</td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-[var(--color-primary)]
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>View</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderUsers = () => (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-secondary)]">Users</h2>
                <Button size="sm" onClick={() => {
                    setEditingUser(null);
                    setUserForm({ name: '', email: '', password: '', role: 'customer' });
                    setShowUserModal(true);
                }}>
                    <Plus size={16} className="mr-2" />
                    Add User
                </Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                        <tr>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Name</th>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Email</th>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Role</th>
                            <th className="p-4 font-medium text-[var(--color-text-muted)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                                <td className="p-4 font-medium">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="p-1 hover:text-[var(--color-primary)]"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-1 hover:text-[var(--color-danger)]"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCategories = () => (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6">Categories</h2>
            <div className="mb-6 flex gap-4">
                <Input
                    placeholder="New Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white p-4 rounded-lg shadow-sm border border-[var(--color-border)] flex justify-between items-center">
                        <span className="font-medium">{cat.name}</span>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBanners = () => (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6">Banners</h2>
            <div className="mb-6 flex gap-4">
                <Input
                    placeholder="Banner Image URL"
                    value={newBanner}
                    onChange={(e) => setNewBanner(e.target.value)}
                    className="flex-grow"
                />
                <Button onClick={handleAddBanner}>Add Banner</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className="bg-white p-4 rounded-lg shadow-sm border border-[var(--color-border)]">
                        <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover rounded-md mb-4" />
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{banner.title}</span>
                            <button onClick={() => handleDeleteBanner(banner.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-6">Content Management</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                <h3 className="text-lg font-bold mb-4">About Us Page Content</h3>
                <textarea
                    className="w-full h-40 p-4 border border-[var(--color-border)] rounded-md mb-4 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                />
                <Button onClick={handleUpdateContent}>Update Content</Button>
            </div>
        </div>
    );

    return (
        <div className="flex relative">
            {renderSidebar()}
            <div className="flex-grow bg-gray-50">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'categories' && renderCategories()}
                {activeTab === 'banners' && renderBanners()}
                {activeTab === 'content' && renderContent()}
            </div>
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

            {/* User Management Modal */}
            <AnimatePresence>
                {showUserModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative"
                        >
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                            <form onSubmit={handleUserSubmit} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    value={userForm.password}
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Role</label>
                                    <select
                                        value={userForm.role}
                                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Product Management Modal */}
            <AnimatePresence>
                {showProductModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <Input
                                    label="Product Name"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Description"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Price"
                                    type="number"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Category</label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    label="Image URL"
                                    value={productForm.image}
                                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                    required
                                />
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="inStock"
                                        checked={productForm.inStock}
                                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <label htmlFor="inStock" className="text-sm font-medium text-[var(--color-text-muted)]">In Stock</label>
                                </div>
                                <Button type="submit" className="w-full">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
