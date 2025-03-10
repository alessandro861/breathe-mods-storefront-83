
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
const initialPaidMods = [
  {
    id: 3,
    title: "Capture Flag",
    image: "/lovable-uploads/efd47a0f-a1d2-4ba9-9247-4980de10939d.png",
    description: "Engage in intense capture the flag battles at the airfield. Features team-based gameplay, custom flags, and special capture points.",
    url: "https://www.youtube.com/watch?v=z8jlj59gg2Y",
    repackPrice: "15€",
    isPaid: true
  }
];

const PaidMods = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [currentMod, setCurrentMod] = useState<Mod | null>(null);
  
  // Use localStorage to persist mods across page reloads
  const [paidMods, setPaidMods] = useState<Mod[]>(() => {
    const savedMods = localStorage.getItem('breathe-paid-mods');
    return savedMods ? JSON.parse(savedMods) : initialPaidMods;
  });

  // Ensure localStorage has the initial data if it's empty
  useEffect(() => {
    if (!localStorage.getItem('breathe-paid-mods')) {
      localStorage.setItem('breathe-paid-mods', JSON.stringify(initialPaidMods));
      setPaidMods(initialPaidMods);
    }
  }, []);

  // Save mods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('breathe-paid-mods', JSON.stringify(paidMods));
  }, [paidMods]);

  const handleAddMod = (newMod: Omit<Mod, 'id'>) => {
    // Generate a new ID by finding the maximum existing ID and adding 1
    const maxId = paidMods.reduce((max, mod) => Math.max(max, mod.id), 0);
    const modWithId = { ...newMod, id: maxId + 1, isPaid: true };
    
    setPaidMods([...paidMods, modWithId]);
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
    
    setPaidMods(paidMods.map(mod => 
      mod.id === currentMod.id ? { ...updatedMod, id: currentMod.id, isPaid: true } : mod
    ));
    
    setModDialogOpen(false);
    setCurrentMod(null);
    
    toast({
      title: "Mod Updated",
      description: `${updatedMod.title} has been updated successfully`,
    });
  };

  const handleDeleteMod = (id: number) => {
    setPaidMods(paidMods.filter(mod => mod.id !== id));
    
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
          <h1 className="text-3xl font-bold text-shine">Paid DayZ Mods</h1>
          
          {isAdmin && (
            <Dialog open={modDialogOpen} onOpenChange={setModDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setCurrentMod(null)}
                  className="interactive-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Paid Mod
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>
                    {currentMod ? "Edit Mod" : "Add New Paid Mod"}
                  </DialogTitle>
                  <DialogDescription>
                    {currentMod ? "Edit the details of your mod" : "Add a new paid mod to your collection"}
                  </DialogDescription>
                </DialogHeader>
                <ModForm 
                  mod={currentMod || { isPaid: true }}
                  onSubmit={currentMod ? handleUpdateMod : handleAddMod}
                  onCancel={handleCancelEdit}
                  isPaidOnly={true}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paidMods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              isAdmin={isAdmin}
              onEdit={handleEditMod}
              onDelete={handleDeleteMod}
            />
          ))}
          
          {paidMods.length === 0 && (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-400">No paid mods available at the moment.</p>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default PaidMods;
