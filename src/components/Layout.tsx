
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
                <div className="relative bg-background/40 backdrop-blur-sm p-2 rounded-xl flex items-center border border-white/10 shadow-lg hover:shadow-primary/20 transition duration-300">
                  <img 
                    src="/lovable-uploads/0cb8c13e-0e13-4275-984a-93719a2a77e1.png" 
                    alt="Breathe Mods Logo" 
                    className="h-12 w-12 mr-3 filter drop-shadow-md"
                  />
                  <div>
                    <span className="text-2xl font-bold text-shine tracking-tight">Breathe Mods</span>
                    <div className="text-xs text-gray-400">Premium Mods</div>
                  </div>
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
