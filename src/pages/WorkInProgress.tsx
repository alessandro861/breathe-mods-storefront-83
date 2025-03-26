
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Construction, Sofa, Plus, Pencil, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';

interface FurnitureMod {
  id: number;
  title: string;
  image: string;
  description: string;
}

const initialFurnitureMods = [
  {
    id: 1,
    title: "Complete Workshop Set",
    image: "/lovable-uploads/58e5571e-0b7e-45cd-8e07-a13b1afe81cc.png",
    description: "Modular cabinet system with integrated workbench and tool storage"
  },
  {
    id: 2,
    title: "Storage Systems",
    image: "/lovable-uploads/f2cf25d9-9ea7-4b3b-b838-92624f9fc398.png",
    description: "Industrial grade cabinets and shelving units with customizable interiors"
  },
  {
    id: 3,
    title: "Wall Panel Systems",
    image: "/lovable-uploads/1bfd498f-bfaf-4cbf-a667-00adb116c079.png",
    description: "Modular wall panels with mounting options for weapons"
  },
  {
    id: 4,
    title: "Component System",
    image: "/lovable-uploads/4b17693f-3657-4527-9bcc-b92c125faef5.png",
    description: "Individual furniture components for custom arrangements and setups"
  }
];

const FurnitureModForm = ({ 
  mod, 
  onSubmit, 
  onCancel 
}: { 
  mod?: FurnitureMod;
  onSubmit: (mod: Omit<FurnitureMod, 'id'>) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(mod?.title || '');
  const [image, setImage] = useState(mod?.image || '');
  const [description, setDescription] = useState(mod?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      image,
      description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Furniture Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter furniture title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Furniture Image</label>
        <ImageUpload 
          imageUrl={image} 
          onImageUpload={setImage} 
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter furniture description"
          required
        />
      </div>
      
      <div className="flex space-x-2 pt-2">
        <Button type="submit" className="flex-1">
          {mod ? "Update Furniture" : "Add Furniture"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const WorkInProgress = () => {
  const [progress, setProgress] = useState(0);
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMod, setCurrentMod] = useState<FurnitureMod | null>(null);
  
  const [furnitureMods, setFurnitureMods] = useState<FurnitureMod[]>(() => {
    const savedMods = localStorage.getItem('breathe-furniture-mods');
    return savedMods ? JSON.parse(savedMods) : initialFurnitureMods;
  });

  useEffect(() => {
    if (!localStorage.getItem('breathe-furniture-mods')) {
      localStorage.setItem('breathe-furniture-mods', JSON.stringify(initialFurnitureMods));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('breathe-furniture-mods', JSON.stringify(furnitureMods));
  }, [furnitureMods]);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(65), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddMod = (newMod: Omit<FurnitureMod, 'id'>) => {
    const maxId = furnitureMods.reduce((max, mod) => Math.max(max, mod.id), 0);
    const modWithId = { ...newMod, id: maxId + 1 };
    
    setFurnitureMods([...furnitureMods, modWithId]);
    setDialogOpen(false);
    
    toast({
      title: "Furniture Added",
      description: `${newMod.title} has been added successfully`,
    });
  };

  const handleEditMod = (mod: FurnitureMod) => {
    setCurrentMod(mod);
    setDialogOpen(true);
  };

  const handleUpdateMod = (updatedMod: Omit<FurnitureMod, 'id'>) => {
    if (!currentMod) return;
    
    setFurnitureMods(furnitureMods.map(mod => 
      mod.id === currentMod.id ? { ...updatedMod, id: currentMod.id } : mod
    ));
    
    setDialogOpen(false);
    setCurrentMod(null);
    
    toast({
      title: "Furniture Updated",
      description: `${updatedMod.title} has been updated successfully`,
    });
  };

  const handleDeleteMod = (id: number) => {
    setFurnitureMods(furnitureMods.filter(mod => mod.id !== id));
    
    toast({
      title: "Furniture Deleted",
      description: "The furniture has been removed successfully",
      variant: "destructive",
    });
  };

  const handleCancelEdit = () => {
    setDialogOpen(false);
    setCurrentMod(null);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-shine flex items-center justify-center gap-3">
            <Construction className="h-8 w-8 text-primary animate-pulse" />
            Work in Progress
            <Construction className="h-8 w-8 text-primary animate-pulse" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4">
            Our team is currently working on exciting new features and mods for you. 
            Check back soon to see what we've been creating!
          </p>
          <div className="max-w-md mx-auto mt-6 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Development Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Furniture Category Section */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-3 mb-4 w-full justify-between">
              <div className="flex items-center gap-3">
                <Sofa className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Furniture Mods</h2>
              </div>
              
              {isAdmin && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setCurrentMod(null)}
                      size="sm"
                      className="interactive-button"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Furniture
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>
                        {currentMod ? "Edit Furniture" : "Add New Furniture"}
                      </DialogTitle>
                      <DialogDescription>
                        {currentMod ? "Edit the details of your furniture" : "Add a new furniture mod to the showcase"}
                      </DialogDescription>
                    </DialogHeader>
                    <FurnitureModForm 
                      mod={currentMod || undefined}
                      onSubmit={currentMod ? handleUpdateMod : handleAddMod}
                      onCancel={handleCancelEdit}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {furnitureMods.map((mod) => (
                <div key={mod.id} className="glass-panel rounded-lg overflow-hidden relative">
                  <img 
                    src={mod.image} 
                    alt={mod.title} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{mod.title}</h3>
                    <p className="text-sm text-gray-300">{mod.description}</p>
                  </div>
                  
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 bg-black/70 hover:bg-black/90"
                        onClick={() => handleEditMod(mod)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-8 w-8 bg-red-800/70 hover:bg-red-700/90"
                        onClick={() => handleDeleteMod(mod.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="w-full max-w-xl mt-6">
              <Progress value={65} className="h-2" />
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default WorkInProgress;
