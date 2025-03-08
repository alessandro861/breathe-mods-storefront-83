
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { ExternalLink, PackageCheck } from 'lucide-react';

// Mod card component for individual mods
const ModCard = ({ 
  title, 
  image, 
  description, 
  url, 
  repackPrice 
}: { 
  title: string; 
  image: string; 
  description: string; 
  url: string;
  repackPrice: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-xl overflow-hidden shadow-lg"
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/800x400?text=Mod+Image";
          }}
        />
        <div className="absolute top-3 right-3 bg-primary/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
          Free Mod
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-shine">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <PackageCheck className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Repack: {repackPrice}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="interactive-button button-shine rounded-lg px-4 py-2 flex-1 flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View on Steam</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const FreeMods = () => {
  // Mod data
  const mods = [
    {
      id: 1,
      title: "Tarkov Medicine Mod",
      image: "https://steamuserimages-a.akamaihd.net/ugc/2554754286131076107/E1E0A2FD7BF6835EE44A6EACAAAF45FE3B9183BF/?imw=637&imh=358&ima=fit&impolicy=Letterbox",
      description: "Enhanced medical system inspired by Escape from Tarkov. Adds realistic medical items and healing mechanics to DayZ.",
      url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3399774519&searchtext=Tarkov+medicine",
      repackPrice: "10€"
    },
    {
      id: 2,
      title: "Helicrash Mod",
      image: "https://steamuserimages-a.akamaihd.net/ugc/2554754286135923954/4E59AFFFB5E45DFF4753231CA4F3B7FED5FEE14C/?imw=637&imh=358&ima=fit&impolicy=Letterbox",
      description: "Improved helicopter crash sites with enhanced loot, visual effects, and more frequent spawns for an exciting gameplay experience.",
      url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3404088257&searchtext=Helicrash",
      repackPrice: "10€"
    }
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-4 text-shine"
          >
            FREE MODS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-300 max-w-3xl mx-auto"
          >
            Download these mods for free and enhance your DayZ experience. Professional repack service available for 10€ per mod.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {mods.map((mod) => (
            <ModCard
              key={mod.id}
              title={mod.title}
              image={mod.image}
              description={mod.description}
              url={mod.url}
              repackPrice={mod.repackPrice}
            />
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default FreeMods;
