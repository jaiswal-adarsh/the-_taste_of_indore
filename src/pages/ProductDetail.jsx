import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
                // Set initial image
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                } else {
                    setActiveImage(data.image);
                }
                // Set initial variant
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                navigate('/shop'); // Redirect if not found
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        const itemToAdd = {
            ...product,
            id: selectedVariant ? `${product.id}-${selectedVariant.weight}` : product.id,
            price: selectedVariant ? selectedVariant.price : product.price,
            weight: selectedVariant ? selectedVariant.weight : null,
            image: activeImage || product.image
        };
        addToCart(itemToAdd, quantity);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    if (!product) return null;

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Shop
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                >
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
                        <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
                            <img
                                src={activeImage || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                    {/* Image Gallery */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[var(--color-primary)]' : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <div className="mb-2 text-[var(--color-primary)] font-medium uppercase tracking-wide">
                        {product.category}
                    </div>
                    <h1 className="text-4xl font-bold text-[var(--color-secondary)] mb-4 font-heading">
                        {product.name}
                    </h1>

                    <div className="flex items-center mb-6">
                        <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                                    className={i < Math.floor(product.rating) ? "" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="text-[var(--color-text-muted)]">
                            ({product.reviews} reviews)
                        </span>
                    </div>

                    <div className="text-3xl font-bold text-[var(--color-secondary)] mb-6">
                        ₹{currentPrice}
                    </div>

                    {/* Variants Selector */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                                Select Weight
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${selectedVariant === variant
                                                ? 'border-[var(--color-primary)] bg-orange-50 text-[var(--color-primary)] font-medium'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        {variant.weight}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-[var(--color-text-main)] text-lg leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center border border-[var(--color-border)] rounded-md">
                            <button
                                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                            <button
                                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <Button
                            size="lg"
                            className="flex-grow rounded-full shadow-lg shadow-orange-200"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2" />
                            Add to Cart
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <Truck className="text-[var(--color-primary)] mr-3" size={24} />
                            <div>
                                <div className="font-bold text-sm">Fast Delivery</div>
                                <div className="text-xs text-gray-500">Within 2-3 days</div>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <ShieldCheck className="text-[var(--color-primary)] mr-3" size={24} />
                            <div>
                                <div className="font-bold text-sm">Quality Assured</div>
                                <div className="text-xs text-gray-500">Authentic Taste</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
