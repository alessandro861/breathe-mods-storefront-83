
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 md:py-24 text-center">
      {/* Logo Effect */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.2
        }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-breathing-glow"></div>
        <div className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-shine">
          BREATHE MODS
        </div>
      </motion.div>
      
      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6"
      >
        Enhance your DayZ experience with premium modifications
      </motion.p>
      
      {/* Animated Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="w-40 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8"
      />
      
      {/* Feature Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-12"
      >
        {[
          { title: "High Quality", desc: "Meticulously crafted modifications" },
          { title: "Regularly Updated", desc: "Stay current with game updates" },
          { title: "Custom Options", desc: "Request personalized mods" }
        ].map((feature, index) => (
          <div key={index} className="glass-panel rounded-lg p-4">
            <h3 className="text-primary font-medium mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroSection;
