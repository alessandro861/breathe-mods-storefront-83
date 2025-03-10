
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Save } from 'lucide-react';
import { sendDiscordWebhook } from '@/utils/discordIntegration';

interface DiscordSettingsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DiscordSettings: React.FC<DiscordSettingsProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('discord-webhook-url') || '';
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Validate the URL format (basic check)
      if (webhookUrl && !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
        toast({
          title: "URL de webhook invalide",
          description: "Veuillez saisir une URL de webhook Discord valide commençant par 'https://discord.com/api/webhooks/'",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      // Save the webhook URL to localStorage
      localStorage.setItem('discord-webhook-url', webhookUrl);
      
      // Show success message
      toast({
        title: "Paramètres enregistrés",
        description: "L'URL du webhook Discord a été enregistrée avec succès.",
      });
      
      // Close the dialog
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erreur d'enregistrement",
        description: "Une erreur s'est produite lors de l'enregistrement des paramètres.",
        variant: "destructive",
      });
      console.error("Error saving Discord settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Aucune URL de webhook",
        description: "Veuillez d'abord saisir une URL de webhook Discord.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Send test message with a mention
      const testMessage = {
        content: "<@1336727014291275829> 🔔 **Test de notification depuis Breathe DayZ Mods**\nSi vous voyez ceci, votre webhook est correctement configuré!",
        username: "Breathe Test Bot",
      };
      
      const success = await sendDiscordWebhook(webhookUrl, testMessage);
      
      if (success) {
        toast({
          title: "Test réussi",
          description: "Une notification de test a été envoyée à votre canal Discord avec mention.",
        });
      } else {
        toast({
          title: "Échec du test",
          description: "La notification n'a pas pu être envoyée. Vérifiez l'URL du webhook.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Échec du test",
        description: "Impossible de se connecter à Discord. Vérifiez l'URL et votre connexion internet.",
        variant: "destructive",
      });
      console.error("Error testing webhook:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> 
            Paramètres d'intégration Discord
          </DialogTitle>
          <DialogDescription>
            Configurez votre webhook Discord pour recevoir les notifications d'achat.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL du Webhook Discord</Label>
            <Input
              id="webhook-url"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Cette URL sera utilisée pour envoyer des notifications d'achat à votre canal Discord.
            </p>
          </div>
          
          <div className="p-4 border rounded-md bg-muted/50">
            <h4 className="font-medium mb-2">Comment configurer un webhook Discord :</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Ouvrez les paramètres de votre serveur Discord</li>
              <li>Allez dans "Intégrations" → "Webhooks"</li>
              <li>Cliquez sur "Nouveau Webhook"</li>
              <li>Nommez-le et sélectionnez le canal pour les notifications</li>
              <li>Copiez l'URL du webhook et collez-la ci-dessus</li>
            </ol>
          </div>
          
          <div className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestWebhook}
              className="w-full"
              disabled={!webhookUrl}
            >
              Tester le Webhook
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? "Enregistrement..." : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscordSettings;
