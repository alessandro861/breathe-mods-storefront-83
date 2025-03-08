
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import NavButton from '../components/NavButton';
import HeroSection from '../components/HeroSection';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col items-center justify-center">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Navigation Buttons */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <NavButton to="/rules" label="Rules" delay={0.1} />
          <NavButton to="/free-mods" label="Free Mods" delay={0.2} />
          <NavButton to="/paid-mods" label="Paid Mods" delay={0.3} />
          <NavButton to="/request" label="Request a Mod" delay={0.4} />
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
