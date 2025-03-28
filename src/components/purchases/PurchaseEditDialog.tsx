
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Server, Globe, Plug, Save, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Purchase, getCurrentUser, updateWhitelistForPurchase } from '@/services/userService';
import { createDiscordUpdateMessage, sendDiscordWebhook } from '@/utils/discordIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define the form schema with validation
const editFormSchema = z.object({
  serverName: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  serverIp: z.string().min(7, { 
    message: "Please enter a valid server IP address." 
  }),
  serverPort: z.string().min(1, {
    message: "Please enter a valid server port."
  }),
});

// Second whitelist schema is the same
const secondWhitelistSchema = editFormSchema;

type EditFormValues = z.infer<typeof editFormSchema>;
type SecondWhitelistValues = z.infer<typeof secondWhitelistSchema>;

interface PurchaseEditDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  purchase: Purchase;
  onPurchaseUpdated: (purchase: Purchase) => void;
}

const PurchaseEditDialog: React.FC<PurchaseEditDialogProps> = ({
  isOpen,
  setIsOpen,
  purchase,
  onPurchaseUpdated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("primary");
  const [showSecondWhitelist, setShowSecondWhitelist] = useState(false);
  const { toast } = useToast();
  
  // Initialize primary whitelist form with validation
  const primaryForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      serverName: purchase.serverName || '',
      serverIp: purchase.serverIp || '',
      serverPort: purchase.serverPort || '',
    },
  });
  
  // Initialize secondary whitelist form
  const secondaryForm = useForm<SecondWhitelistValues>({
    resolver: zodResolver(secondWhitelistSchema),
    defaultValues: {
      serverName: purchase.secondServerName || '',
      serverIp: purchase.secondServerIp || '',
      serverPort: purchase.secondServerPort || '',
    },
  });
  
  // Update form values when purchase changes
  useEffect(() => {
    primaryForm.reset({
      serverName: purchase.serverName || '',
      serverIp: purchase.serverIp || '',
      serverPort: purchase.serverPort || '',
    });
    
    secondaryForm.reset({
      serverName: purchase.secondServerName || '',
      serverIp: purchase.secondServerIp || '',
      serverPort: purchase.secondServerPort || '',
    });
    
    // Check if we should show the second whitelist tab
    setShowSecondWhitelist(!!purchase.secondServerName);
    
  }, [purchase, isOpen]);
  
  const onSubmitPrimary = async (data: EditFormValues) => {
    setIsSubmitting(true);
    
    try {
      const userEmail = getCurrentUser();
      
      if (!userEmail) {
        toast({
          title: "Error",
          description: "You must be logged in to update your purchase.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the purchase in the database
      const updatedPurchase = updateWhitelistForPurchase(
        userEmail, 
        purchase.id, 
        {
          serverName: data.serverName,
          serverIp: data.serverIp,
          serverPort: data.serverPort
        },
        false // This is the primary whitelist
      );
      
      if (!updatedPurchase) {
        throw new Error("Failed to update purchase details");
      }
      
      // Send notification to Discord - use the purchase webhook URL from WebhookSettings
      const purchaseWebhookUrl = localStorage.getItem('purchase-webhook-url') || '';
      const purchaseNotificationsEnabled = localStorage.getItem('purchase-notifications-enabled') === 'true';
      
      if (purchaseWebhookUrl && purchaseNotificationsEnabled) {
        // Create a message for the update notification using the utility function
        const message = createDiscordUpdateMessage(
          purchase.productName || purchase.modName,
          data.serverName,
          data.serverIp,
          data.serverPort
        );
        
        try {
          await sendDiscordWebhook(purchaseWebhookUrl, message);
          console.log("Discord notification sent for primary whitelist update");
        } catch (error) {
          console.error("Failed to send Discord notification:", error);
          // Continue with the process even if Discord notification fails
        }
      }
      
      // Call the callback to update UI
      onPurchaseUpdated(updatedPurchase);
      
      toast({
        title: "Primary whitelist updated",
        description: "Your server details have been updated successfully.",
      });
      
      if (activeTab === "primary" && !showSecondWhitelist) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error updating purchase:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmitSecondary = async (data: SecondWhitelistValues) => {
    setIsSubmitting(true);
    
    try {
      const userEmail = getCurrentUser();
      
      if (!userEmail) {
        toast({
          title: "Error",
          description: "You must be logged in to update your purchase.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the purchase in the database with second whitelist
      const updatedPurchase = updateWhitelistForPurchase(
        userEmail, 
        purchase.id, 
        {
          serverName: data.serverName,
          serverIp: data.serverIp,
          serverPort: data.serverPort
        },
        true // This is the secondary whitelist
      );
      
      if (!updatedPurchase) {
        throw new Error("Failed to update purchase details");
      }
      
      // Send notification to Discord - use the purchase webhook URL from WebhookSettings
      const purchaseWebhookUrl = localStorage.getItem('purchase-webhook-url') || '';
      const purchaseNotificationsEnabled = localStorage.getItem('purchase-notifications-enabled') === 'true';
      
      if (purchaseWebhookUrl && purchaseNotificationsEnabled) {
        // Add "Secondary" label to make it clear this is for the second whitelist
        const message = {
          content: `🔄 **Purchase Update - Secondary Whitelist**\n` +
            `Product: **${purchase.productName || purchase.modName}**\n` +
            `Secondary Server Name: **${data.serverName}** (Added/Updated)\n` +
            `Secondary Server IP: **${data.serverIp}** (Added/Updated)\n` +
            `Secondary Server Port: **${data.serverPort}** (Added/Updated)\n`,
          username: "Breathe Mods Bot",
          avatar_url: "https://cdn-icons-png.flaticon.com/512/1067/1067357.png"
        };
        
        try {
          await sendDiscordWebhook(purchaseWebhookUrl, message);
          console.log("Discord notification sent for secondary whitelist update");
        } catch (error) {
          console.error("Failed to send Discord notification:", error);
        }
      }
      
      // Call the callback to update UI
      onPurchaseUpdated(updatedPurchase);
      setShowSecondWhitelist(true);
      
      toast({
        title: "Secondary whitelist updated",
        description: "Your additional server details have been updated successfully.",
      });
      
      if (activeTab === "secondary") {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error updating secondary whitelist:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating your secondary whitelist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" /> 
            Manage Whitelists
          </DialogTitle>
          <DialogDescription>
            Update server information for: {purchase.productName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="primary" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="primary">Primary Whitelist</TabsTrigger>
              <TabsTrigger 
                value="secondary" 
                disabled={!showSecondWhitelist && activeTab !== "secondary"}
              >
                Secondary Whitelist
              </TabsTrigger>
            </TabsList>
            
            {!showSecondWhitelist && activeTab === "primary" && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setActiveTab("secondary")}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Second Whitelist
              </Button>
            )}
          </div>
          
          <TabsContent value="primary" className="mt-4">
            <Form {...primaryForm}>
              <form onSubmit={primaryForm.handleSubmit(onSubmitPrimary)} className="space-y-4">
                <FormField
                  control={primaryForm.control}
                  name="serverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Server" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={primaryForm.control}
                  name="serverIp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        Server IP
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={primaryForm.control}
                  name="serverPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Plug className="h-4 w-4 text-muted-foreground" />
                        Server Port
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="30120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="secondary" className="mt-4">
            <div className="mb-4">
              <Badge variant="outline" className="px-2 py-1 border-primary/30 bg-primary/10">
                Whitelist 2 of 2
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                You can add a second whitelist for this purchase. This allows you to use the mod on two different servers.
              </p>
            </div>
            
            <Form {...secondaryForm}>
              <form onSubmit={secondaryForm.handleSubmit(onSubmitSecondary)} className="space-y-4">
                <FormField
                  control={secondaryForm.control}
                  name="serverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        Secondary Server Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="My Second Server" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={secondaryForm.control}
                  name="serverIp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        Secondary Server IP
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={secondaryForm.control}
                  name="serverPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Plug className="h-4 w-4 text-muted-foreground" />
                        Secondary Server Port
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="30120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      if (showSecondWhitelist) {
                        setActiveTab("primary");
                      } else {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {showSecondWhitelist ? "Back" : "Cancel"}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {showSecondWhitelist ? "Update Whitelist" : "Add Whitelist"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseEditDialog;
