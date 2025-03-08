
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center py-12 md:py-16 text-center">
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
