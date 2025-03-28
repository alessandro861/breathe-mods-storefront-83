
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { BellRing, MessageSquare, ShoppingCart, Ticket, Send, Wifi } from 'lucide-react';
import { sendDiscordWebhook } from '@/utils/discordIntegration';

const WebhookSettings = () => {
  const { toast } = useToast();
  const [ticketWebhook, setTicketWebhook] = useState(() => localStorage.getItem('ticket-webhook-url') || '');
  const [purchaseWebhook, setPurchaseWebhook] = useState(() => localStorage.getItem('purchase-webhook-url') || '');
  const [transcriptWebhook, setTranscriptWebhook] = useState(() => localStorage.getItem('transcript-webhook-url') || '');
  const [whitelistWebhook, setWhitelistWebhook] = useState(() => localStorage.getItem('whitelist-webhook-url') || '');
  
  const [ticketNotificationsEnabled, setTicketNotificationsEnabled] = useState(() => 
    localStorage.getItem('ticket-notifications-enabled') === 'true'
  );
  const [purchaseNotificationsEnabled, setPurchaseNotificationsEnabled] = useState(() => 
    localStorage.getItem('purchase-notifications-enabled') === 'true'
  );
  const [transcriptEnabled, setTranscriptEnabled] = useState(() => 
    localStorage.getItem('transcript-enabled') === 'true'
  );
  const [whitelistNotificationsEnabled, setWhitelistNotificationsEnabled] = useState(() => 
    localStorage.getItem('whitelist-notifications-enabled') === 'true'
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveSettings = (type: 'ticket' | 'purchase' | 'transcript' | 'whitelist') => {
    setIsSaving(true);
    try {
      let webhookUrl = '';
      let enabled = false;
      
      // Get the correct webhook URL and enabled status based on type
      if (type === 'ticket') {
        webhookUrl = ticketWebhook;
        enabled = ticketNotificationsEnabled;
        localStorage.setItem('ticket-webhook-url', ticketWebhook);
        localStorage.setItem('ticket-notifications-enabled', ticketNotificationsEnabled.toString());
      } else if (type === 'purchase') {
        webhookUrl = purchaseWebhook;
        enabled = purchaseNotificationsEnabled;
        localStorage.setItem('purchase-webhook-url', purchaseWebhook);
        localStorage.setItem('purchase-notifications-enabled', purchaseNotificationsEnabled.toString());
      } else if (type === 'transcript') {
        webhookUrl = transcriptWebhook;
        enabled = transcriptEnabled;
        localStorage.setItem('transcript-webhook-url', transcriptWebhook);
        localStorage.setItem('transcript-enabled', transcriptEnabled.toString());
      } else if (type === 'whitelist') {
        webhookUrl = whitelistWebhook;
        enabled = whitelistNotificationsEnabled;
        localStorage.setItem('whitelist-webhook-url', whitelistWebhook);
        localStorage.setItem('whitelist-notifications-enabled', whitelistNotificationsEnabled.toString());
      }
      
      // Basic validation
      if (enabled && webhookUrl && !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
        toast({
          title: "Invalid webhook URL",
          description: "Please enter a valid Discord webhook URL starting with 'https://discord.com/api/webhooks/'",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Settings saved",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} notification settings have been updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "An error occurred while saving the settings.",
        variant: "destructive",
      });
      console.error(`Error saving ${type} webhook settings:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWebhook = async (type: 'ticket' | 'purchase' | 'transcript' | 'whitelist') => {
    setIsTesting(true);
    
    let webhookUrl = '';
    let testMessage = {};
    
    // Get the correct webhook URL and test message based on type
    if (type === 'ticket') {
      webhookUrl = ticketWebhook;
      testMessage = {
        content: "🎫 **Test Ticket Notification**\nThis is a test ticket notification from the admin dashboard.",
        username: "Breathe Ticket Bot",
      };
    } else if (type === 'purchase') {
      webhookUrl = purchaseWebhook;
      testMessage = {
        content: "💰 **Test Purchase Notification**\nThis is a test purchase notification from the admin dashboard.",
        username: "Breathe Purchase Bot",
      };
    } else if (type === 'transcript') {
      webhookUrl = transcriptWebhook;
      testMessage = {
        content: "📝 **Test Ticket Transcript**\nThis is a test ticket transcript notification from the admin dashboard.",
        username: "Breathe Transcript Bot",
      };
    } else if (type === 'whitelist') {
      webhookUrl = whitelistWebhook;
      testMessage = {
        content: "🔒 **Test Whitelist Notification**\nServer Name: **Test Server**\nServer IP: **127.0.0.1**\nServer Port: **25565**",
        username: "Breathe Whitelist Bot",
      };
    }
    
    try {
      if (!webhookUrl) {
        toast({
          title: "No webhook URL",
          description: "Please enter a webhook URL first.",
          variant: "destructive",
        });
        setIsTesting(false);
        return;
      }
      
      const success = await sendDiscordWebhook(webhookUrl, testMessage);
      
      if (success) {
        toast({
          title: "Test successful",
          description: "The test notification was sent successfully.",
        });
      } else {
        toast({
          title: "Test failed",
          description: "The notification could not be sent. Check the webhook URL.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Failed to connect to Discord. Check the URL and your internet connection.",
        variant: "destructive",
      });
      console.error("Error testing webhook:", error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="tickets" className="flex gap-1 items-center">
            <Ticket className="h-4 w-4" /> Ticket Notifications
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex gap-1 items-center">
            <ShoppingCart className="h-4 w-4" /> Purchase Notifications
          </TabsTrigger>
          <TabsTrigger value="whitelist" className="flex gap-1 items-center">
            <Wifi className="h-4 w-4" /> Whitelist Notifications
          </TabsTrigger>
          <TabsTrigger value="transcripts" className="flex gap-1 items-center">
            <MessageSquare className="h-4 w-4" /> Ticket Transcripts
          </TabsTrigger>
        </TabsList>
        
        {/* Ticket Notifications Tab */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Ticket Notifications
              </CardTitle>
              <CardDescription>
                Configure webhook settings for ticket notifications. Receive a notification when a new ticket is created.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Enable Ticket Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    Receive a Discord notification when a new support ticket is created
                  </p>
                </div>
                <Switch 
                  checked={ticketNotificationsEnabled} 
                  onCheckedChange={setTicketNotificationsEnabled} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ticket-webhook">Discord Webhook URL</Label>
                <Input
                  id="ticket-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={ticketWebhook}
                  onChange={(e) => setTicketWebhook(e.target.value)}
                  disabled={!ticketNotificationsEnabled}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleTestWebhook('ticket')}
                  disabled={!ticketNotificationsEnabled || isTesting || !ticketWebhook}
                >
                  Test Webhook
                </Button>
                <Button 
                  onClick={() => handleSaveSettings('ticket')}
                  disabled={isSaving}
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Purchase Notifications Tab */}
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Purchase Notifications
              </CardTitle>
              <CardDescription>
                Configure webhook settings for purchase notifications. Receive a notification when a purchase is made.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Enable Purchase Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    Receive a Discord notification when a user makes a purchase
                  </p>
                </div>
                <Switch 
                  checked={purchaseNotificationsEnabled} 
                  onCheckedChange={setPurchaseNotificationsEnabled} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchase-webhook">Discord Webhook URL</Label>
                <Input
                  id="purchase-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={purchaseWebhook}
                  onChange={(e) => setPurchaseWebhook(e.target.value)}
                  disabled={!purchaseNotificationsEnabled}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleTestWebhook('purchase')}
                  disabled={!purchaseNotificationsEnabled || isTesting || !purchaseWebhook}
                >
                  Test Webhook
                </Button>
                <Button 
                  onClick={() => handleSaveSettings('purchase')}
                  disabled={isSaving}
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Whitelist Notifications Tab */}
        <TabsContent value="whitelist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                Whitelist Notifications
              </CardTitle>
              <CardDescription>
                Configure webhook settings for whitelist notifications. Receive a notification when a user adds or updates server whitelist information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Enable Whitelist Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    Receive a Discord notification when a user adds or updates server information (name, IP, port)
                  </p>
                </div>
                <Switch 
                  checked={whitelistNotificationsEnabled} 
                  onCheckedChange={setWhitelistNotificationsEnabled} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whitelist-webhook">Discord Webhook URL</Label>
                <Input
                  id="whitelist-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={whitelistWebhook}
                  onChange={(e) => setWhitelistWebhook(e.target.value)}
                  disabled={!whitelistNotificationsEnabled}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleTestWebhook('whitelist')}
                  disabled={!whitelistNotificationsEnabled || isTesting || !whitelistWebhook}
                >
                  Test Webhook
                </Button>
                <Button 
                  onClick={() => handleSaveSettings('whitelist')}
                  disabled={isSaving}
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Ticket Transcripts Tab */}
        <TabsContent value="transcripts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Ticket Transcripts
              </CardTitle>
              <CardDescription>
                Configure webhook settings for ticket transcripts. Send a transcript to Discord when a ticket is closed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Enable Ticket Transcripts</h4>
                  <p className="text-xs text-muted-foreground">
                    Send a transcript to Discord when a ticket is closed
                  </p>
                </div>
                <Switch 
                  checked={transcriptEnabled} 
                  onCheckedChange={setTranscriptEnabled} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transcript-webhook">Discord Webhook URL</Label>
                <Input
                  id="transcript-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={transcriptWebhook}
                  onChange={(e) => setTranscriptWebhook(e.target.value)}
                  disabled={!transcriptEnabled}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleTestWebhook('transcript')}
                  disabled={!transcriptEnabled || isTesting || !transcriptWebhook}
                >
                  Test Webhook
                </Button>
                <Button 
                  onClick={() => handleSaveSettings('transcript')}
                  disabled={isSaving}
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border rounded-md bg-muted/50">
        <h4 className="font-medium mb-2">How to set up Discord webhooks:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open your Discord server settings</li>
          <li>Go to "Integrations" → "Webhooks"</li>
          <li>Click on "New Webhook"</li>
          <li>Name it and select the channel for notifications</li>
          <li>Copy the webhook URL and paste it in the appropriate field above</li>
        </ol>
      </div>
    </div>
  );
};

export default WebhookSettings;
