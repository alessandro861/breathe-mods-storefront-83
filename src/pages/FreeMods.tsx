import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Plus, Settings } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ModCard, { Mod } from '@/components/mods/ModCard';
import ModForm from '@/components/mods/ModForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscordSettings from '@/components/mods/DiscordSettings';

const initialFreeMods = [
  {
    id: 1,
    title: "Tarkov Medicine Mod",
    image: "/lovable-uploads/55cc4101-b11d-425b-a3de-8a72b07af5ad.png",
    description: "Enhanced medical system inspired by Escape from Tarkov. Adds realistic medical items and healing mechanics to DayZ.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3399774519&searchtext=Tarkov+medicine",
    repackPrice: "10€",
    isPaid: false
  },
  {
    id: 2,
    title: "Helicrash Updated (Breathe mods)",
    image: "/lovable-uploads/b2bac61f-7532-4ab8-afcb-8ff6df198f79.png",
    description: "Improved helicopter crash sites with enhanced loot, visual effects, and more frequent spawns for an exciting gameplay experience.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3404088257&searchtext=Helicrash",
    repackPrice: "10€",
    isPaid: false
  }
];

const initialPaidMods = [
  {
    id: 3,
    title: "Capture Flag",
    image: "/lovable-uploads/efd47a0f-a1d2-4ba9-9247-4980de10939d.png",
    description: "Engage in intense capture the flag battles at the airfield. Features team-based gameplay, custom flags, and special capture points.",
    url: "https://www.youtube.com/watch?v=z8jlj59gg2Y",
    repackPrice: "Basic Price 45€<br/>Buying EMP with Capture Flag Price 65€",
    isPaid: true
  }
];

const FreeMods = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [currentMod, setCurrentMod] = useState<Mod | null>(null);
  const [activeTab, setActiveTab] = useState("free");
  const [discordSettingsOpen, setDiscordSettingsOpen] = useState(false);
  
  const [freeMods, setFreeMods] = useState<Mod[]>(() => {
    const savedMods = localStorage.getItem('breathe-free-mods');
    return savedMods ? JSON.parse(savedMods) : initialFreeMods;
  });

  const [paidMods, setPaidMods] = useState<Mod[]>(() => {
    const savedMods = localStorage.getItem('breathe-paid-mods');
    return savedMods ? JSON.parse(savedMods) : initialPaidMods;
  });

  useEffect(() => {
    if (!localStorage.getItem('breathe-paid-mods')) {
      localStorage.setItem('breathe-paid-mods', JSON.stringify(initialPaidMods));
      setPaidMods(initialPaidMods);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('breathe-free-mods', JSON.stringify(freeMods));
  }, [freeMods]);

  useEffect(() => {
    localStorage.setItem('breathe-paid-mods', JSON.stringify(paidMods));
  }, [paidMods]);

  const handleAddMod = (newMod: Omit<Mod, 'id'>) => {
    const targetMods = newMod.isPaid ? paidMods : freeMods;
    const setTargetMods = newMod.isPaid ? setPaidMods : setFreeMods;
    
    const maxId = [...freeMods, ...paidMods].reduce((max, mod) => Math.max(max, mod.id), 0);
    const modWithId = { ...newMod, id: maxId + 1 };
    
    setTargetMods([...targetMods, modWithId]);
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
    
    if (updatedMod.isPaid !== currentMod.isPaid) {
      if (updatedMod.isPaid) {
        setFreeMods(freeMods.filter(mod => mod.id !== currentMod.id));
        setPaidMods([...paidMods, { ...updatedMod, id: currentMod.id }]);
      } else {
        setPaidMods(paidMods.filter(mod => mod.id !== currentMod.id));
        setFreeMods([...freeMods, { ...updatedMod, id: currentMod.id }]);
      }
    } else {
      if (updatedMod.isPaid) {
        setPaidMods(paidMods.map(mod => 
          mod.id === currentMod.id ? { ...updatedMod, id: currentMod.id } : mod
        ));
      } else {
        setFreeMods(freeMods.map(mod => 
          mod.id === currentMod.id ? { ...updatedMod, id: currentMod.id } : mod
        ));
      }
    }
    
    setModDialogOpen(false);
    setCurrentMod(null);
    
    toast({
      title: "Mod Updated",
      description: `${updatedMod.title} has been updated successfully`,
    });
  };

  const handleDeleteMod = (id: number) => {
    const isInFreeMods = freeMods.some(mod => mod.id === id);
    
    if (isInFreeMods) {
      setFreeMods(freeMods.filter(mod => mod.id !== id));
    } else {
      setPaidMods(paidMods.filter(mod => mod.id !== id));
    }
    
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
          <h1 className="text-3xl font-bold text-shine">DayZ Mods</h1>
          
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => setDiscordSettingsOpen(true)}
                  title="Discord Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
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
              </>
            )}
          </div>
        </div>
        
        <DiscordSettings 
          isOpen={discordSettingsOpen}
          setIsOpen={setDiscordSettingsOpen}
        />

        <Tabs defaultValue="free" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free">Free Mods</TabsTrigger>
            <TabsTrigger value="paid">Paid Mods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="free" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {freeMods.map((mod) => (
                <ModCard
                  key={mod.id}
                  mod={mod}
                  isAdmin={isAdmin}
                  onEdit={handleEditMod}
                  onDelete={handleDeleteMod}
                />
              ))}
              
              {freeMods.length === 0 && (
                <div className="col-span-2 text-center py-10">
                  <p className="text-gray-400">No free mods available at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paid" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default FreeMods;
