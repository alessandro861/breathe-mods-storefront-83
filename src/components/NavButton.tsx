
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface NavButtonProps {
  to: string;
  label: string;
  delay?: number;
  comingSoon?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ to, label, delay = 0, comingSoon = to !== '/rules' && to !== '/free-mods' }) => {
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
        <div className="interactive-button button-shine rounded-xl px-6 py-4 text-center">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{label}</span>
            <ArrowRight className="ml-2 h-5 w-5 text-primary" />
          </div>
          {comingSoon && <div className="mt-1 text-xs text-gray-400">Coming Soon</div>}
        </div>
      </Link>
    </motion.div>
  );
};

export default NavButton;
