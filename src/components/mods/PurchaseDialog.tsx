
import React, { useState, useEffect } from 'react';
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
import { Shield, Settings } from 'lucide-react';
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
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [discordToken, setDiscordToken] = useState('');
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  
  // Récupérer les données stockées au chargement du composant
  useEffect(() => {
    if (isAdmin) {
      const storedWebhookUrl = localStorage.getItem('discord-webhook-url') || '';
      const storedDiscordToken = localStorage.getItem('discord-bot-token') || '';
      setWebhookUrl(storedWebhookUrl);
      setDiscordToken(storedDiscordToken);
    }
  }, [isAdmin]);
  
  // URL du webhook Zapier (par défaut ou configurée par l'admin)
  const zapierWebhookUrl = isAdmin ? 
    webhookUrl || 'https://hooks.zapier.com/hooks/catch/your-webhook-id/' : 
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
          discordToken: isAdmin ? discordToken : null, // Envoyer le token seulement si c'est un admin
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

  // Pour les administrateurs, permettre de configurer les paramètres
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('discord-webhook-url', webhookUrl);
    localStorage.setItem('discord-bot-token', discordToken);
    
    toast({
      title: "Settings Saved",
      description: "Discord settings have been updated successfully",
    });
    
    setShowSettings(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {!showSettings ? (
          <>
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
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : `Purchase for ${modPrice}`}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> 
                Discord Integration Settings
              </DialogTitle>
              <DialogDescription>
                Configure your Discord integration settings for role assignment.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveSettings} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="webhookUrl" className="text-sm font-medium">Zapier Webhook URL</label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/your-webhook"
                  className="w-full"
                />
                <p className="text-xs text-gray-400">
                  Enter your Zapier webhook URL that will process Discord role assignments.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="discordToken" className="text-sm font-medium">Discord Bot Token</label>
                <Input
                  id="discordToken"
                  type="password"
                  value={discordToken}
                  onChange={(e) => setDiscordToken(e.target.value)}
                  placeholder="Your Discord bot token"
                  className="w-full"
                />
                <p className="text-xs text-gray-400 text-justify">
                  Enter your Discord bot token. This will be securely stored in your browser. 
                  Never share this token publicly. The token will be sent to your Zapier webhook.
                </p>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Settings
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
