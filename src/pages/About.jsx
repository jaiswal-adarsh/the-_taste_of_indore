import React, { useState, useEffect } from 'react';
import { contentService } from '../services/adminServices';
import { motion } from 'framer-motion';

const About = () => {
    const [content, setContent] = useState({ text: '', images: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentService.getAbout();
                setContent(data || { text: '', images: [] });
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center"
            >
                <h1 className="text-4xl font-bold text-[var(--color-secondary)] mb-8 font-heading">About Us</h1>
                {loading ? (
                    <div className="animate-pulse h-40 bg-gray-100 rounded-lg"></div>
                ) : (
                    <div className="space-y-8">
                        {content.images && content.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {content.images.map((img, index) => (
                                    <div key={index} className="rounded-xl overflow-hidden shadow-sm h-64">
                                        <img src={img} alt={`About Us ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="prose prose-lg mx-auto text-[var(--color-text-main)] text-left">
                            <p className="whitespace-pre-wrap">{content.text}</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default About;
