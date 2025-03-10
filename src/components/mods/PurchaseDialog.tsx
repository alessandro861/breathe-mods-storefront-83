
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
import { Shield, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { assignRoleViaZapier } from '@/utils/discordIntegration';

// Define the form schema with validation
const purchaseFormSchema = z.object({
  discordUsername: z.string().min(2, {
    message: "Discord username must be at least 2 characters.",
  }),
  serverIP: z.string().min(7, { 
    message: "Please enter a valid server IP address." 
  }),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Discord webhook URL - in a production app, this should be stored in environment variables
  const discordWebhookUrl = "https://discord.com/api/webhooks/your-webhook-id/your-webhook-token";

  // Initialize form with validation
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      discordUsername: "",
      serverIP: "",
    },
  });

  const sendDiscordNotification = async (formData: PurchaseFormValues) => {
    try {
      // Format for Discord message
      const message = {
        embeds: [{
          title: `New Purchase: ${modTitle}`,
          color: 0x5865F2, // Discord blue color
          fields: [
            {
              name: "Discord Username",
              value: formData.discordUsername,
              inline: true
            },
            {
              name: "Server IP",
              value: formData.serverIP,
              inline: true
            },
            {
              name: "Price",
              value: modPrice.replace(/<br\/>/g, " - "), // Remove HTML tags for Discord
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      // Send notification to Discord
      // Note: This direct approach won't work from browser due to CORS
      // We'll use the Zapier integration approach instead
      await assignRoleViaZapier(formData.discordUsername, discordWebhookUrl);

      return true;
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
      return false;
    }
  };
  
  const onSubmit = async (data: PurchaseFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Send Discord notification
      const notificationSent = await sendDiscordNotification(data);
      
      // Simulate processing time (in a real app, this would be your payment processing)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (notificationSent) {
        toast({
          title: "Purchase processed",
          description: `You have purchased ${modTitle}. A notification has been sent to our Discord.`,
        });
      } else {
        // Still allow purchase even if notification fails
        toast({
          title: "Purchase processed",
          description: `You have purchased ${modTitle}. (Note: Discord notification failed)`,
        });
      }
      
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
      console.error("Purchase error:", error);
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
            Please provide your information to complete the purchase.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="discordUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username#1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serverIP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server IP</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000.000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-primary/10 p-3 rounded-md">
              <div className="flex justify-between font-medium">
                <span>Price:</span>
                <span dangerouslySetInnerHTML={{ __html: modPrice }}></span>
              </div>
            </div>
            
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
                    <Send className="h-4 w-4" />
                    Complete Purchase
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

export default PurchaseDialog;
