import React, { useState, useEffect } from 'react';
import { contentService } from '../services/adminServices';
import { motion } from 'framer-motion';

const About = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentService.getAbout();
                setContent(data);
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
                className="max-w-3xl mx-auto text-center"
            >
                <h1 className="text-4xl font-bold text-[var(--color-secondary)] mb-8 font-heading">About Us</h1>
                {loading ? (
                    <div className="animate-pulse h-40 bg-gray-100 rounded-lg"></div>
                ) : (
                    <div className="prose prose-lg mx-auto text-[var(--color-text-main)]">
                        <p className="whitespace-pre-wrap">{content}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default About;
