
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';
import { Link, useLocation } from 'react-router-dom';
import { Construction, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAdmin, logout } = useAdmin();
  
  // Define navigation items including Work in Progress
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/free-mods', label: 'Mods' },
    { path: '/rules', label: 'Rules' },
    { path: '/request', label: 'Request Mod' },
    { path: '/wip', label: 'Work in Progress', icon: <Construction className="h-4 w-4 mr-1" /> },
  ];
  
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
        {/* Header with Logo and Navigation */}
        <header className="py-4 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <a href="https://discord.gg/Yr8aY3fW4f" target="_blank" rel="noopener noreferrer" className="flex items-center mb-4 md:mb-0">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-background/40 backdrop-blur-sm p-2 rounded-xl flex items-center border border-white/10 shadow-lg hover:shadow-primary/20 transition duration-300">
                    <img 
                      src="/lovable-uploads/78c9ee5d-bf68-4af2-9b44-a035c2bde3da.png" 
                      alt="Breathe Mods Logo" 
                      className="h-12 w-12 mr-3 filter drop-shadow-md"
                    />
                    <div>
                      <span className="text-2xl font-bold text-shine tracking-tight">Breathe Mods</span>
                      <div className="text-xs text-gray-400">Premium Mods</div>
                    </div>
                  </div>
                </div>
              </a>
              
              {/* Navigation */}
              <div className="flex items-center">
                <nav className="flex flex-wrap justify-center gap-2 mr-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                        location.pathname === item.path
                          ? 'bg-primary/20 text-white font-medium'
                          : 'hover:bg-white/5 text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.icon && item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
                
                {isAdmin ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                    onClick={logout}
                  >
                    Log Out (Admin)
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      Log In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
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
