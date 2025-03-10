
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
import { useAdmin } from '@/hooks/useAdmin';

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
  const { isAdmin } = useAdmin();
  
  // Utilisez cette URL pour Zapier - vous pouvez créer un Zap qui écoute ce webhook
  // et fait ensuite quelque chose avec Discord (ajout de rôle via Bot Discord)
  const zapierWebhookUrl = isAdmin ? 
    localStorage.getItem('discord-webhook-url') || '' : 
    'https://hooks.zapier.com/hooks/catch/your-webhook-id/';

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
      // Envoi des données à Zapier qui peut ensuite interagir avec Discord
      const response = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Pour éviter les problèmes CORS avec Zapier
        body: JSON.stringify({
          discordUsername,
          modTitle,
          modPrice,
          purchaseDate: new Date().toISOString()
        }),
      });
      
      // Comme nous utilisons no-cors, nous ne pouvons pas vérifier response.ok
      setIsOpen(false);
      
      // Afficher un message de succès
      toast({
        title: "Purchase Successful!",
        description: `You've purchased ${modTitle}. A Discord role will be assigned to ${discordUsername} within 24 hours.`,
      });
      
      // Réinitialiser le formulaire
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

  // Pour les administrateurs, permettre de configurer l'URL du webhook
  const handleSetWebhookUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const webhookUrl = prompt("Enter your Zapier Discord webhook URL:");
    
    if (webhookUrl) {
      localStorage.setItem('discord-webhook-url', webhookUrl);
      toast({
        title: "Webhook URL Updated",
        description: "Discord webhook URL has been updated successfully",
      });
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
            {isAdmin && (
              <Button type="button" variant="secondary" onClick={handleSetWebhookUrl}>
                Set Webhook URL
              </Button>
            )}
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
