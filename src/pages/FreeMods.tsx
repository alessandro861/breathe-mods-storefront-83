
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Plus, Settings, Ticket } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ModCard, { Mod } from '@/components/mods/ModCard';
import ModForm from '@/components/mods/ModForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscordSettings from '@/components/mods/DiscordSettings';
import PurchaseDialog from '@/components/mods/PurchaseDialog';
import { Link } from 'react-router-dom';
import ModFilters, { ModTag, SortOption } from '@/components/mods/ModFilters';

// Dates pour les mods initiaux
const initialFreeMods = [
  {
    id: 1,
    title: "Tarkov Medicine Mod",
    image: "/lovable-uploads/55cc4101-b11d-425b-a3de-8a72b07af5ad.png",
    description: "Enhanced medical system inspired by Escape from Tarkov. Adds realistic medical items and healing mechanics to DayZ.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3399774519&searchtext=Tarkov+medicine",
    repackPrice: "10€",
    isPaid: false,
    tags: ["medic", "UI"] as ModTag[],
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Helicrash Updated (Breathe mods)",
    image: "/lovable-uploads/b2bac61f-7532-4ab8-afcb-8ff6df198f79.png",
    description: "Improved helicopter crash sites with enhanced loot, visual effects, and more frequent spawns for an exciting gameplay experience.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3404088257&searchtext=Helicrash",
    repackPrice: "10€",
    isPaid: false,
    tags: ["reward", "gear"] as ModTag[],
    date: "2024-02-20"
  }
];

const initialPaidMods = [
  {
    id: 3,
    title: "Capture Flag",
    image: "/lovable-uploads/efd47a0f-a1d2-4ba9-9247-4980de10939d.png",
    description: "Engage in intense capture the flag battles at the airfield. Features team-based gameplay, custom flags, and special capture points.",
    url: "https://www.youtube.com/watch?v=z8jlj59gg2Y",
    repackPrice: "45€",
    isPaid: true,
    tags: ["reward", "gear", "weapon"] as ModTag[],
    date: "2024-03-05"
  }
];

const FreeMods = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [currentMod, setCurrentMod] = useState<Mod | null>(null);
  const [activeTab, setActiveTab] = useState("free");
  const [discordSettingsOpen, setDiscordSettingsOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  
  // Filtres et tri
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<ModTag[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortOption, setSortOption] = useState<SortOption>("name");
  
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

  const handlePurchase = (mod: Mod) => {
    setSelectedMod(mod);
    setPurchaseDialogOpen(true);
  };

  // Filtrage et tri des mods
  const getFilteredMods = (mods: Mod[]) => {
    return mods
      .filter(mod => {
        // Filtrage par recherche
        const matchesSearch = mod.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              mod.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtrage par tags
        const matchesTags = selectedTags.length === 0 || 
                           (mod.tags && selectedTags.every(tag => mod.tags?.includes(tag)));
        
        // Filtrage par prix
        const priceNumber = extractPriceNumber(mod.repackPrice);
        const matchesPrice = priceNumber >= priceRange[0] && priceNumber <= priceRange[1];
        
        return matchesSearch && matchesTags && matchesPrice;
      })
      .sort((a, b) => {
        // Tri
        switch (sortOption) {
          case 'name':
            return a.title.localeCompare(b.title);
          case 'price-high':
            return extractPriceNumber(b.repackPrice) - extractPriceNumber(a.repackPrice);
          case 'price-low':
            return extractPriceNumber(a.repackPrice) - extractPriceNumber(b.repackPrice);
          case 'date':
            return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
          default:
            return 0;
        }
      });
  };
  
  // Fonction pour extraire le prix numérique
  const extractPriceNumber = (priceString: string): number => {
    const match = priceString.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Calculer le prix minimum et maximum pour les sliders
  const minMaxPrice = React.useMemo(() => {
    const allMods = [...freeMods, ...paidMods];
    let min = 100, max = 0;
    
    allMods.forEach(mod => {
      const price = extractPriceNumber(mod.repackPrice);
      min = Math.min(min, price);
      max = Math.max(max, price);
    });
    
    return { min, max };
  }, [freeMods, paidMods]);

  // Filtrer les mods en fonction des critères
  const filteredFreeMods = getFilteredMods(freeMods);
  const filteredPaidMods = getFilteredMods(paidMods);

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
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Ticket className="h-5 w-5 text-primary mr-2" />
            <span className="text-white font-medium">Want a mod? Create a ticket!</span>
          </div>
          <Link to="/tickets">
            <Button size="sm" variant="default">
              Create Ticket
            </Button>
          </Link>
        </div>
        
        <DiscordSettings 
          isOpen={discordSettingsOpen}
          setIsOpen={setDiscordSettingsOpen}
        />

        {selectedMod && (
          <PurchaseDialog
            isOpen={purchaseDialogOpen}
            setIsOpen={setPurchaseDialogOpen}
            modTitle={selectedMod.title}
            modPrice={selectedMod.repackPrice}
          />
        )}

        <ModFilters
          minPrice={minMaxPrice.min}
          maxPrice={minMaxPrice.max}
          priceRange={priceRange}
          selectedTags={selectedTags}
          selectedSort={sortOption}
          searchTerm={searchTerm}
          onPriceRangeChange={setPriceRange}
          onTagsChange={setSelectedTags}
          onSearchChange={setSearchTerm}
          onSortChange={setSortOption}
        />

        <Tabs defaultValue="free" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free">Free Mods</TabsTrigger>
            <TabsTrigger value="paid">Paid Mods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="free" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredFreeMods.map((mod) => (
                <ModCard
                  key={mod.id}
                  mod={mod}
                  isAdmin={isAdmin}
                  onEdit={handleEditMod}
                  onDelete={handleDeleteMod}
                  onPurchase={handlePurchase}
                />
              ))}
              
              {filteredFreeMods.length === 0 && (
                <div className="col-span-2 text-center py-10">
                  <p className="text-gray-400">No free mods available at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPaidMods.map((mod) => (
                <ModCard
                  key={mod.id}
                  mod={mod}
                  isAdmin={isAdmin}
                  onEdit={handleEditMod}
                  onDelete={handleDeleteMod}
                  onPurchase={handlePurchase}
                />
              ))}
              
              {filteredPaidMods.length === 0 && (
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
