
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';
import { Link } from 'react-router-dom';

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
        {/* Header with Logo */}
        <header className="py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-background p-1 rounded-lg flex items-center">
                  <img 
                    src="/lovable-uploads/78c9ee5d-bf68-4af2-9b44-a035c2bde3da.png" 
                    alt="Breathe Mods Logo" 
                    className="h-10 w-10 mr-2"
                  />
                  <span className="text-xl font-semibold text-shine hidden sm:block">Breathe Mods</span>
                </div>
              </div>
            </Link>
          </div>
        </header>
        
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
