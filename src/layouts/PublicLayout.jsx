import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CartSheet from '@/components/CartSheet';
import Footer from '@/components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Corporate Navbar */}
      <Navbar />

      {/* Slide-over Cart Drawer */}
      <CartSheet />

      {/* Responsive Main Container rendering children through Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Corporate Rebranded Footer with Real Contact Information */}
      <Footer />
    </div>
  );
}
