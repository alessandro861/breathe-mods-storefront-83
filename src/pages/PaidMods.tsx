
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Plus, Ticket } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ModCard, { Mod } from '@/components/mods/ModCard';
import ModForm from '@/components/mods/ModForm';
import PurchaseDialog from '@/components/mods/PurchaseDialog';
import { Link } from 'react-router-dom';
import ModFilters, { ModTag, SortOption } from '@/components/mods/ModFilters';

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

const PaidMods = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [currentMod, setCurrentMod] = useState<Mod | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  
  // Filtres et tri
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<ModTag[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortOption, setSortOption] = useState<SortOption>("name");
  
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
    localStorage.setItem('breathe-paid-mods', JSON.stringify(paidMods));
  }, [paidMods]);

  const handleAddMod = (newMod: Omit<Mod, 'id'>) => {
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

  const handlePurchase = (mod: Mod) => {
    setSelectedMod(mod);
    setPurchaseDialogOpen(true);
  };

  // Fonction pour extraire le prix numérique
  const extractPriceNumber = (priceString: string): number => {
    const match = priceString.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Calculer le prix minimum et maximum pour les sliders
  const minMaxPrice = React.useMemo(() => {
    let min = 100, max = 0;
    
    paidMods.forEach(mod => {
      const price = extractPriceNumber(mod.repackPrice);
      min = Math.min(min, price);
      max = Math.max(max, price);
    });
    
    return { min, max: Math.max(max, 100) };
  }, [paidMods]);

  // Filtrage et tri des mods
  const filteredMods = paidMods
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              isAdmin={isAdmin}
              onEdit={handleEditMod}
              onDelete={handleDeleteMod}
              onPurchase={handlePurchase}
            />
          ))}
          
          {filteredMods.length === 0 && (
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
