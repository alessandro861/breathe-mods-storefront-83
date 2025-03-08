import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { ExternalLink, PackageCheck, Plus, Trash, Edit, Save } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

// Initial mods data
const initialMods = [
  {
    id: 1,
    title: "Tarkov Medicine Mod",
    image: "/lovable-uploads/55cc4101-b11d-425b-a3de-8a72b07af5ad.png",
    description: "Enhanced medical system inspired by Escape from Tarkov. Adds realistic medical items and healing mechanics to DayZ.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3399774519&searchtext=Tarkov+medicine",
    repackPrice: "10€"
  },
  {
    id: 2,
    title: "Helicrash Updated (Breathe mods)",
    image: "/lovable-uploads/b2bac61f-7532-4ab8-afcb-8ff6df198f79.png",
    description: "Improved helicopter crash sites with enhanced loot, visual effects, and more frequent spawns for an exciting gameplay experience.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3404088257&searchtext=Helicrash",
    repackPrice: "10€"
  }
];

// ModForm component
const ModForm = ({ 
  mod, 
  onSubmit, 
  onCancel 
}: { 
  mod?: typeof initialMods[0], 
  onSubmit: (mod: Omit<typeof initialMods[0], 'id'>) => void,
  onCancel: () => void
}) => {
  const [title, setTitle] = useState(mod?.title || '');
  const [image, setImage] = useState(mod?.image || '');
  const [description, setDescription] = useState(mod?.description || '');
  const [url, setUrl] = useState(mod?.url || '');
  const [repackPrice, setRepackPrice] = useState(mod?.repackPrice || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      image,
      description,
      url,
      repackPrice
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Mod Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter mod title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Mod Image</label>
        <ImageUpload currentImage={image} onImageChange={setImage} />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter mod description"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">Steam URL</label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Steam workshop URL"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="repackPrice" className="text-sm font-medium">Repack Price</label>
        <Input
          id="repackPrice"
          value={repackPrice}
          onChange={(e) => setRepackPrice(e.target.value)}
          placeholder="e.g. 10€"
          required
        />
      </div>
      
      <div className="flex space-x-2 pt-2">
        <Button type="submit" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Save Mod
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Mod card component for individual mods
const ModCard = ({ 
  mod,
  onEdit,
  onDelete,
  isAdmin
}: { 
  mod: typeof initialMods[0];
  onEdit?: (mod: typeof initialMods[0]) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
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

const FreeMods = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [currentMod, setCurrentMod] = useState<typeof initialMods[0] | null>(null);
  
  // Use localStorage to persist mods across page reloads
  const [mods, setMods] = useState(() => {
    const savedMods = localStorage.getItem('breathe-free-mods');
    return savedMods ? JSON.parse(savedMods) : initialMods;
  });

  // Save mods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('breathe-free-mods', JSON.stringify(mods));
  }, [mods]);

  const handleAddMod = (newMod: Omit<typeof initialMods[0], 'id'>) => {
    // Generate a new ID by finding the maximum existing ID and adding 1
    const maxId = mods.reduce((max, mod) => Math.max(max, mod.id), 0);
    const modWithId = { ...newMod, id: maxId + 1 };
    
    setMods([...mods, modWithId]);
    setModDialogOpen(false);
    
    toast({
      title: "Mod Added",
      description: `${newMod.title} has been added successfully`,
    });
  };

  const handleEditMod = (mod: typeof initialMods[0]) => {
    setCurrentMod(mod);
    setModDialogOpen(true);
  };

  const handleUpdateMod = (updatedMod: Omit<typeof initialMods[0], 'id'>) => {
    if (!currentMod) return;
    
    const updatedMods = mods.map(mod => 
      mod.id === currentMod.id ? { ...updatedMod, id: currentMod.id } : mod
    );
    
    setMods(updatedMods);
    setModDialogOpen(false);
    setCurrentMod(null);
    
    toast({
      title: "Mod Updated",
      description: `${updatedMod.title} has been updated successfully`,
    });
  };

  const handleDeleteMod = (id: number) => {
    setMods(mods.filter(mod => mod.id !== id));
    
    toast({
      title: "Mod Deleted",
      description: "The mod has been removed successfully",
      variant: "destructive",
    });
  };

  const handleCancelEdit = () => {
    setModDialogOpen(false);
    setCurrentMod(null);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-shine">Free Mods</h1>
          
          {isAdmin && (
            <Dialog open={modDialogOpen} onOpenChange={setModDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setCurrentMod(null)}
                  className="interactive-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Mod
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>
                    {currentMod ? "Edit Mod" : "Add New Mod"}
                  </DialogTitle>
                  <DialogDescription>
                    {currentMod ? "Edit the details of your mod" : "Add a new mod to your collection"}
                  </DialogDescription>
                </DialogHeader>
                <ModForm 
                  mod={currentMod || undefined}
                  onSubmit={currentMod ? handleUpdateMod : handleAddMod}
                  onCancel={handleCancelEdit}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {mods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              isAdmin={isAdmin}
              onEdit={handleEditMod}
              onDelete={handleDeleteMod}
            />
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default FreeMods;
