
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface NavButtonProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  delay?: number;
  comingSoon?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  to, 
  label, 
  icon, 
  delay = 0, 
  comingSoon = to !== '/rules' && to !== '/free-mods' && to !== '/wip'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={to} className="block">
        <div className="interactive-button button-shine rounded-xl px-6 py-5 text-center h-full">
          <div className="flex items-center justify-between mb-1">
            {icon && <span className="mr-2">{icon}</span>}
            <span className="text-lg font-medium flex-grow text-left">{label}</span>
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          {comingSoon && <div className="text-xs text-gray-400">Coming Soon</div>}
        </div>
      </Link>
    </motion.div>
  );
};

export default NavButton;
