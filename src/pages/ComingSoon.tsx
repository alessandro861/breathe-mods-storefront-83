
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the page name from the path
  const pageName = location.pathname.substring(1)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <Layout>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-breathing-glow"></div>
            <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-shine">
              {pageName}
            </h1>
          </div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-40 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8"
          />
          
          <div className="glass-panel rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-300 mb-6">
              We are working hard to bring you the best DayZ mods. This section will be available soon.
            </p>
            
            <motion.button
              onClick={() => navigate('/')}
              className="interactive-button button-shine rounded-lg px-5 py-2.5 flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ComingSoon;
