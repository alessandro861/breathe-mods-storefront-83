
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, ShoppingCart } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PurchaseDialog from './PurchaseDialog';

export interface Mod {
  id: number;
  title: string;
  image: string;
  description: string;
  url: string;
  repackPrice: string;
  isPaid: boolean;
}

interface ModCardProps {
  mod: Mod;
  isAdmin: boolean;
  onEdit: (mod: Mod) => void;
  onDelete: (id: number) => void;
}

const ModCard: React.FC<ModCardProps> = ({ mod, isAdmin, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  return (
    <Card className="h-full flex flex-col bg-card/40 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={mod.image || '/placeholder.svg'}
          alt={mod.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {mod.isPaid && (
          <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-md text-xs font-medium">
            PAID
          </div>
        )}
      </div>
      
      <CardContent className="py-4 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-shine">{mod.title}</h3>
        <p className="text-sm text-gray-300 mb-2">{mod.description}</p>
        <p className="text-primary font-semibold mt-2">Repack Price: {mod.repackPrice}</p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex flex-wrap gap-2">
        <a 
          href={mod.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full text-sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {mod.isPaid ? "View Preview" : "View on Workshop"}
          </Button>
        </a>
        
        {mod.isPaid && (
          <Button 
            className="w-full text-sm bg-primary hover:bg-primary/90"
            onClick={() => setShowPurchaseDialog(true)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Now
          </Button>
        )}
        
        {isAdmin && (
          <div className="w-full flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(mod)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mod "{mod.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(mod.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <PurchaseDialog 
        isOpen={showPurchaseDialog} 
        setIsOpen={setShowPurchaseDialog}
        modTitle={mod.title}
        modPrice={mod.repackPrice}
      />
    </Card>
  );
};

export default ModCard;
