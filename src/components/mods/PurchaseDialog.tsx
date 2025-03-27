
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Shield, Send, Flag, DollarSign, AtSign, Server, Globe, Plug } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createDiscordPurchaseMessage, sendDiscordWebhook } from '@/utils/discordIntegration';
import { getCurrentUser, addPurchase } from '@/services/userService';
import { useNavigate } from 'react-router-dom';

// Define the form schema with validation
const purchaseFormSchema = z.object({
  discordUsername: z.string().min(2, {
    message: "Discord username must be at least 2 characters.",
  }),
  serverName: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  serverIP: z.string().min(7, { 
    message: "Please enter a valid server IP address." 
  }),
  serverPort: z.string().min(1, {
    message: "Please enter a valid server port."
  }),
  priceOption: z.enum(['basic', 'withEMP'], {
    required_error: "Please select a price option.",
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
  const navigate = useNavigate();
  
  // Store webhook URL in state and refresh it each time the dialog opens
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
  
  // ID of the Discord user to mention
  const discordUserIdToPing = '1336727014291275829';

  // Refresh webhook URL when dialog opens
  useEffect(() => {
    if (isOpen) {
      const storedWebhookUrl = localStorage.getItem('discord-webhook-url') || '';
      setDiscordWebhookUrl(storedWebhookUrl);
      console.log("[PurchaseDialog] Loaded Discord webhook URL:", storedWebhookUrl ? "URL exists" : "No URL found");
    }
  }, [isOpen]);

  // Initialize form with validation
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      discordUsername: "",
      serverName: "",
      serverIP: "",
      serverPort: "",
      priceOption: "basic",
    },
  });

  const onSubmit = async (data: PurchaseFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("[Purchase] Processing purchase for mod:", modTitle);
      console.log("[Purchase] User data:", data);
      
      // Refresh the webhook URL right before sending to ensure it's the latest
      const freshWebhookUrl = localStorage.getItem('discord-webhook-url') || '';
      
      // Determine the price based on the selected option
      const selectedPriceText = data.priceOption === 'basic' ? '45€' : '65€ (with EMP)';
      const selectedPrice = data.priceOption === 'basic' ? 45 : 65;
      
      // Generate a unique ID for the purchase
      const purchaseId = `p${Date.now()}`;
      
      // Check if user is logged in
      const userEmail = getCurrentUser();
      
      // If logged in, save the purchase to user account
      if (userEmail) {
        const purchaseData = {
          id: purchaseId,
          productName: modTitle,
          date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
          price: selectedPrice,
          serverIp: data.serverIP,
          serverName: data.serverName,
          serverPort: data.serverPort
        };
        
        const purchaseSaved = addPurchase(userEmail, purchaseData);
        
        if (!purchaseSaved) {
          console.error("[Purchase] Failed to save purchase to user account");
        } else {
          console.log("[Purchase] Purchase saved to user account:", purchaseData);
        }
      } else {
        console.log("[Purchase] User not logged in - purchase not saved to account");
      }
      
      // Try to send Discord notification
      console.log("[Purchase] Attempting Discord notification...");
      console.log("[Purchase] Using webhook URL:", freshWebhookUrl ? "URL exists" : "No URL");
      
      if (freshWebhookUrl) {
        // Create message with mention and all the fields
        const message = createDiscordPurchaseMessage(
          modTitle,
          data.discordUsername,
          data.serverName,
          data.serverIP,
          data.serverPort,
          selectedPriceText,
          discordUserIdToPing
        );
        
        // Send notification - await the result
        console.log("[Purchase] Sending to Discord webhook...");
        const notificationSent = await sendDiscordWebhook(freshWebhookUrl, message);
        console.log("[Purchase] Discord notification result:", notificationSent ? "Success" : "Failed");
        
        if (notificationSent) {
          console.log("[Purchase] Notification sent successfully to Discord");
        } else {
          console.error("[Purchase] Failed to send notification to Discord");
          // Don't show error to user - we'll still process the purchase
        }
      } else {
        console.warn("[Purchase] No Discord webhook URL configured - skipping notification");
      }
      
      // Simulate processing time (in a real app, this would be your payment processing)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Purchase processed",
        description: userEmail 
          ? `You have purchased ${modTitle} (${selectedPriceText}). Please consider leaving a review for your purchase.`
          : `You have purchased ${modTitle} (${selectedPriceText}). Create an account to manage your purchases.`,
        duration: 5000
      });
      
      form.reset();
      setIsOpen(false);
      
      // Redirect to review page if user is logged in
      if (userEmail) {
        setTimeout(() => {
          toast({
            title: "Would you like to leave a review?",
            description: "Your feedback helps us improve!",
            action: (
              <Button variant="outline" onClick={() => navigate(`/submit-review?productId=${purchaseId}&productName=${encodeURIComponent(modTitle)}`)}>
                Write Review
              </Button>
            ),
            duration: 8000
          });
        }, 1000);
      }
    } catch (error) {
      console.error("[Purchase] Error:", error);
      
      toast({
        title: "Error",
        description: "An error occurred while processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show different price options only for Capture Flag mod
  const showPriceOptions = modTitle === "Capture Flag";

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
                  <FormLabel className="flex items-center gap-1">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    Discord Username
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="username#1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    Name of Server
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
              name="serverIP"
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
            
            {showPriceOptions && (
              <FormField
                control={form.control}
                name="priceOption"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Price Option</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 p-2 border border-border rounded-md hover:bg-accent">
                          <RadioGroupItem value="basic" id="basic" />
                          <label htmlFor="basic" className="flex items-center gap-2 cursor-pointer w-full">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <div>
                              <span className="font-medium">Basic Price</span>
                              <p className="text-sm text-muted-foreground">Capture Flag mod only - 45€</p>
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 border border-border rounded-md hover:bg-accent">
                          <RadioGroupItem value="withEMP" id="withEMP" />
                          <label htmlFor="withEMP" className="flex items-center gap-2 cursor-pointer w-full">
                            <Flag className="h-4 w-4 text-blue-500" />
                            <div>
                              <span className="font-medium">Capture Flag with EMP</span>
                              <p className="text-sm text-muted-foreground">Includes EMP functionality - 65€</p>
                            </div>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {!showPriceOptions && (
              <div className="bg-primary/10 p-3 rounded-md">
                <div className="flex justify-between font-medium">
                  <span>Price:</span>
                  <span dangerouslySetInnerHTML={{ __html: modPrice }}></span>
                </div>
              </div>
            )}
            
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
