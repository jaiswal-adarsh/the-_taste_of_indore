import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';
import { ShoppingCart, User, LogOut, Menu, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-[var(--color-primary)] font-heading">
                    The Taste Of Indore
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium transition-colors">
                        Home
                    </Link>
                    <Link to="/shop" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium transition-colors">
                        Shop
                    </Link>
                    <Link to="/about" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium transition-colors">
                        About
                    </Link>
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
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center space-x-2 text-[var(--color-text-main)] hover:text-[var(--color-primary)]">
                                <User size={24} />
                                <span className="hidden md:block font-medium">{user.name}</span>
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
                        <div className="flex items-center space-x-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-[var(--color-text-main)]">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
