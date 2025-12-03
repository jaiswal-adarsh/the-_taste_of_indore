import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Home, ShoppingBag, Info, Phone, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { cart } = useCart();
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/shop', label: 'Shop', icon: ShoppingBag },
        { path: '/about', label: 'About', icon: Info },
        // { path: '/contact', label: 'Contact', icon: Phone },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-[var(--color-primary)] font-heading">
                        The Taste Of Indore
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link to="/admin" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors flex items-center">
                                <LayoutDashboard size={18} className="mr-1" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative p-2 text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center space-x-2 text-[var(--color-text-main)] hover:text-[var(--color-primary)]">
                                    <User size={24} />
                                    <span className="font-medium">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-[var(--color-text-main)] hover:bg-gray-100 rounded-full"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-lg text-[var(--color-secondary)]">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="space-y-1 px-2">
                                    {navLinks.map(link => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[var(--color-text-main)] hover:bg-orange-50 hover:text-[var(--color-primary)] transition-colors"
                                        >
                                            <link.icon size={20} />
                                            <span className="font-medium">{link.label}</span>
                                        </Link>
                                    ))}
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[var(--color-text-main)] hover:bg-orange-50 hover:text-[var(--color-primary)] transition-colors"
                                        >
                                            <LayoutDashboard size={20} />
                                            <span className="font-medium">Admin Dashboard</span>
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-8 px-6">
                                    {isAuthenticated ? (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{user.name}</div>
                                                    <div className="text-xs text-gray-500 truncate w-32">{user.email}</div>
                                                </div>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block w-full text-center py-2 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors mb-2"
                                            >
                                                View Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-center py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-center">Login</Button>
                                            </Link>
                                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="primary" className="w-full justify-center">Sign Up</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
