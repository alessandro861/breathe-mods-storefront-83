
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
import { Server, Globe, Plug, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Purchase, getCurrentUser, updatePurchase } from '@/services/userService';
import { createDiscordPurchaseMessage, sendDiscordWebhook } from '@/utils/discordIntegration';

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

type EditFormValues = z.infer<typeof editFormSchema>;

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
  const { toast } = useToast();
  
  // Initialize form with validation
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      serverName: purchase.serverName || '',
      serverIp: purchase.serverIp || '',
      serverPort: purchase.serverPort || '',
    },
  });

  const onSubmit = async (data: EditFormValues) => {
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
      const success = updatePurchase(userEmail, purchase.id, {
        serverName: data.serverName,
        serverIp: data.serverIp,
        serverPort: data.serverPort
      });
      
      if (!success) {
        throw new Error("Failed to update purchase details");
      }
      
      // Create updated purchase object
      const updatedPurchase: Purchase = {
        ...purchase,
        serverName: data.serverName,
        serverIp: data.serverIp,
        serverPort: data.serverPort
      };
      
      // Send notification to Discord
      const discordWebhookUrl = localStorage.getItem('discord-webhook-url') || '';
      if (discordWebhookUrl) {
        // Create a message for the update notification
        const message = {
          content: `🔄 **Purchase Update**\n` +
            `Product: **${purchase.productName}**\n` +
            `Server Name: **${data.serverName}** (Updated)\n` +
            `Server IP: **${data.serverIp}** (Updated)\n` +
            `Server Port: **${data.serverPort}** (Updated)\n`,
          username: "Breathe Mods Bot",
          avatar_url: "https://cdn-icons-png.flaticon.com/512/1067/1067357.png"
        };
        
        try {
          await sendDiscordWebhook(discordWebhookUrl, message);
          console.log("Discord notification sent for purchase update");
        } catch (error) {
          console.error("Failed to send Discord notification:", error);
          // Continue with the process even if Discord notification fails
        }
      }
      
      // Call the callback to update UI
      onPurchaseUpdated(updatedPurchase);
      
      toast({
        title: "Purchase updated",
        description: "Your server details have been updated successfully.",
      });
      
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" /> 
            Edit Server Details
          </DialogTitle>
          <DialogDescription>
            Update the server information for your purchase: {purchase.productName}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseEditDialog;
