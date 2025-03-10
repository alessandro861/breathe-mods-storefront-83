
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

interface PurchaseDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modTitle: string;
  modPrice: string;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  isOpen,
  setIsOpen,
  modTitle,
  modPrice
}) => {
  const [discordUsername, setDiscordUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordUsername) {
      toast({
        title: "Discord Username Required",
        description: "Please enter your Discord username to receive your role",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Real API endpoint to assign Discord role
      // This is a placeholder URL - replace with your actual API endpoint
      const response = await fetch('https://your-api-endpoint.com/assign-discord-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discordUsername,
          modTitle,
          modPrice,
          purchaseDate: new Date().toISOString()
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process purchase');
      }
      
      setIsOpen(false);
      
      // Show success message
      toast({
        title: "Purchase Successful!",
        description: `You've purchased ${modTitle}. A Discord role will be assigned to ${discordUsername} within 24 hours.`,
      });
      
      // Reset form
      setDiscordUsername('');
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> 
            Purchase {modTitle}
          </DialogTitle>
          <DialogDescription>
            Complete your purchase to receive this mod. A Discord role will be assigned to your account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handlePurchase} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="discordUsername" className="text-sm font-medium">Discord Username</label>
            <Input
              id="discordUsername"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="e.g. username#1234 or username"
              className="w-full"
              required
            />
            <p className="text-xs text-gray-400">
              Enter your Discord username exactly as it appears in Discord.
            </p>
          </div>
          
          <div className="bg-primary/10 p-3 rounded-md">
            <div className="flex justify-between font-medium">
              <span>Price:</span>
              <span>{modPrice}</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              After purchase, you'll receive a Discord role that grants access to the mod download.
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : `Purchase for ${modPrice}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
