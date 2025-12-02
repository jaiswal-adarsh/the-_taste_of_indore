import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-[var(--color-secondary)] text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} The Taste Of Indore. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
