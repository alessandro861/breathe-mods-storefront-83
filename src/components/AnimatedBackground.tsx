
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1219] to-[#162032]"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-background animate-grid-fade"></div>
      
      {/* Subtle spotlight gradients */}
      <motion.div 
        className="absolute left-1/4 top-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute right-1/4 bottom-1/4 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[100px]"
        animate={{ 
          scale: [1.1, 0.9, 1.1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      {/* Floating particles */}
      <ParticlesLayer />
    </div>
  );
};

const ParticlesLayer: React.FC = () => {
  const particles = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 30
  }));

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};

export default AnimatedBackground;
