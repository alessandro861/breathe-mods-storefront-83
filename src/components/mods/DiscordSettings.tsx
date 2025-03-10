
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
import { getZapierImplementationGuide } from '@/utils/discordIntegration';

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
    
    // Simulate API call
    setTimeout(() => {
      // Save the webhook URL to localStorage
      localStorage.setItem('discord-webhook-url', webhookUrl);
      
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Discord webhook URL has been saved.",
      });
      
      setIsOpen(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> 
            Discord Integration Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Discord webhook to receive purchase notifications.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Discord Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              This URL will be used to send purchase notifications to your Discord channel.
            </p>
          </div>
          
          <div className="p-4 border rounded-md bg-muted/50">
            <h4 className="font-medium mb-2">How to set up a Discord webhook:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open your Discord server settings</li>
              <li>Go to "Integrations" → "Webhooks"</li>
              <li>Click "New Webhook"</li>
              <li>Name it and select the channel for notifications</li>
              <li>Copy the webhook URL and paste it above</li>
            </ol>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !webhookUrl}
            className="gap-2"
          >
            {isSaving ? "Saving..." : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscordSettings;
