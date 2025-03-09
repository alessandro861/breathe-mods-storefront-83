
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, PackageCheck, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Mod {
  id: number;
  title: string;
  image: string;
  description: string;
  url: string;
  repackPrice: string;
}

interface ModCardProps {
  mod: Mod;
  onEdit?: (mod: Mod) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

const ModCard: React.FC<ModCardProps> = ({ 
  mod,
  onEdit,
  onDelete,
  isAdmin
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-xl overflow-hidden shadow-lg relative"
    >
      {isAdmin && (
        <div className="absolute top-3 left-3 flex space-x-2 z-10">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 bg-black/40 backdrop-blur-sm"
            onClick={() => onEdit && onEdit(mod)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 bg-red-500/40 backdrop-blur-sm text-red-400 hover:text-red-300 hover:bg-red-500/60"
            onClick={() => onDelete && onDelete(mod.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="relative">
        <img 
          src={mod.image} 
          alt={mod.title} 
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
        <h3 className="text-xl font-bold mb-2 text-shine">{mod.title}</h3>
        <p className="text-gray-300 mb-4">{mod.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <PackageCheck className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Repack: {mod.repackPrice}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <a 
            href={mod.url} 
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

export default ModCard;
