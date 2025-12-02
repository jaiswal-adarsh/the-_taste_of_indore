import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import Button from './Button';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-[var(--color-border)] flex flex-col h-full"
        >
            <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                    </div>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                        {product.category}
                    </div>
                    <div className="flex items-center text-yellow-400 text-xs font-bold">
                        <Star size={14} fill="currentColor" className="mr-1" />
                        {product.rating}
                    </div>
                </div>

                <Link to={`/product/${product.id}`} className="block mb-2">
                    <h3 className="text-lg font-bold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-[var(--color-text-muted)] text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xl font-bold text-[var(--color-secondary)]">
                        ₹{product.price}
                    </span>
                    <Button
                        size="sm"
                        className="rounded-full"
                        disabled={!product.inStock}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={16} className="mr-2" />
                        Add
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
