
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Plus } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ModCard, { Mod } from '@/components/mods/ModCard';
import ModForm from '@/components/mods/ModForm';

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

const FreeMods = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [currentMod, setCurrentMod] = useState<Mod | null>(null);
  
  // Use localStorage to persist mods across page reloads
  const [mods, setMods] = useState<Mod[]>(() => {
    const savedMods = localStorage.getItem('breathe-free-mods');
    return savedMods ? JSON.parse(savedMods) : initialMods;
  });

  // Save mods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('breathe-free-mods', JSON.stringify(mods));
  }, [mods]);

  const handleAddMod = (newMod: Omit<Mod, 'id'>) => {
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

  const handleEditMod = (mod: Mod) => {
    setCurrentMod(mod);
    setModDialogOpen(true);
  };

  const handleUpdateMod = (updatedMod: Omit<Mod, 'id'>) => {
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
