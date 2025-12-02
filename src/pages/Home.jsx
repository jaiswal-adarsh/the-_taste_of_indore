import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { Star, Truck, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await productService.getAllProducts();
                // Get top 4 products (or random, for now just first 4)
                setFeaturedProducts(allProducts.slice(0, 4));
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const reviews = [
        { id: 1, name: "Rahul Sharma", comment: "The Sev is absolutely authentic! Reminds me of my childhood in Indore.", rating: 5 },
        { id: 2, name: "Priya Patel", comment: "Fast delivery and fresh products. The Ratlami Sev is spicy and perfect.", rating: 5 },
        { id: 3, name: "Amit Verma", comment: "Best place to buy Indori Namkeen online. Highly recommended!", rating: 4 },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[700px] flex items-center justify-center overflow-hidden bg-[var(--color-secondary)] text-white">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-[var(--color-secondary)] absolute z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Indore Spices"
                        className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block py-1 px-3 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold mb-4 tracking-wide"
                    >
                        AUTHENTIC FLAVORS
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        The Taste of <span className="text-[var(--color-primary)]">Indore</span><br />
                        Delivered to You
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-200 font-light"
                    >
                        Experience the crunch of authentic Namkeen and the aroma of traditional spices.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/shop">
                            <Button size="lg" className="rounded-full px-10 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                                Shop Now
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button size="lg" variant="outline" className="rounded-full px-10 py-4 text-lg border-white text-white hover:bg-white hover:text-[var(--color-secondary)]">
                                Our Story
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Leaf, title: "100% Authentic", desc: "Traditional recipes passed down through generations." },
                            { icon: Truck, title: "Fast Delivery", desc: "Fresh snacks delivered to your doorstep quickly." },
                            { icon: ShieldCheck, title: "Quality Assured", desc: "Premium ingredients and hygienic preparation." }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-16 h-16 mx-auto bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4 text-[var(--color-primary)]">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-[var(--color-secondary)]">{feature.title}</h3>
                                <p className="text-[var(--color-text-muted)]">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm">Our Bestsellers</span>
                            <h2 className="text-4xl font-bold text-[var(--color-secondary)] mt-2">Featured Delicacies</h2>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center text-[var(--color-primary)] font-medium hover:underline">
                            View All <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => (
                                <Link key={product.id} to={`/product/${product.id}`} className="group">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {!product.inStock && (
                                                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    Out of Stock
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">{product.category}</div>
                                            <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{product.name}</h3>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-[var(--color-secondary)]">₹{product.price}</span>
                                                <div className="flex items-center text-yellow-400 text-sm">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="ml-1 text-gray-600 font-medium">{product.rating || 4.5}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/shop">
                            <Button variant="outline" className="w-full">View All Products</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-[var(--color-secondary)] mb-16">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 p-8 rounded-2xl relative"
                            >
                                <div className="text-[var(--color-primary)] text-6xl absolute top-4 right-6 opacity-20 font-serif">"</div>
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={18} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">"{review.comment}"</p>
                                <div className="font-bold text-[var(--color-secondary)] border-t border-gray-200 pt-4 inline-block">
                                    {review.name}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA */}
            <section className="py-20 bg-[var(--color-secondary)] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Taste the Authenticity?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Order now and get fresh Indori snacks delivered to your home.</p>
                    <Link to="/shop">
                        <Button size="lg" className="rounded-full px-12 py-4 bg-[var(--color-primary)] hover:bg-orange-600 text-white border-none shadow-lg text-lg">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
