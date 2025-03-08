
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>
      
      <motion.div 
        className="flex-1 flex flex-col z-10 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-12">
          {children}
        </main>
        
        <footer className="py-4 px-6 text-center text-sm text-gray-400">
          <div className="container mx-auto">
            © {new Date().getFullYear()} Breathe Mods. All rights reserved.
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Layout;
