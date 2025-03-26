
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative flex flex-col items-center justify-center py-8 md:py-16 text-center px-4 md:px-0">
      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
      >
        ELEVATE YOUR DAYZ EXPERIENCE
      </motion.h1>
      
      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="text-base md:text-xl text-gray-300 max-w-2xl mb-4 md:mb-6"
      >
        Enhance your DayZ experience with premium modifications
      </motion.p>
      
      {/* Animated Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6 md:mb-8"
      />
      
      {/* Feature Points - Only show on larger screens */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-8 md:mb-12"
        >
          {[
            { title: "High Quality", desc: "Meticulously crafted modifications" },
            { title: "Regularly Updated", desc: "Stay current with game updates" },
            { title: "Custom Options", desc: "Request personalized mods" }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel rounded-lg p-5 transform transition-all duration-300 hover:scale-105 hover:shadow-primary/10"
            >
              <h3 className="text-primary font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default HeroSection;
