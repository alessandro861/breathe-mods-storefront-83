
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Shield, Send, Flag, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createDiscordPurchaseMessage, sendDiscordWebhook } from '@/utils/discordIntegration';

// Define the form schema with validation
const purchaseFormSchema = z.object({
  discordUsername: z.string().min(2, {
    message: "Discord username must be at least 2 characters.",
  }),
  serverIP: z.string().min(7, { 
    message: "Please enter a valid server IP address." 
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
  
  // Get Discord webhook URL from localStorage
  const discordWebhookUrl = localStorage.getItem('discord-webhook-url') || '';
  // ID of the Discord user to mention
  const discordUserIdToPing = '1336727014291275829';

  // Initialize form with validation
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      discordUsername: "",
      serverIP: "",
      priceOption: "basic",
    },
  });

  const onSubmit = async (data: PurchaseFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Processing purchase for mod:", modTitle);
      console.log("User data:", data);
      
      // Determine the price based on the selected option
      const selectedPrice = data.priceOption === 'basic' ? '45€' : '65€ (with EMP)';
      
      let notificationSent = false;
      
      if (discordWebhookUrl) {
        // Create message with mention
        const message = createDiscordPurchaseMessage(
          modTitle,
          data.discordUsername,
          data.serverIP,
          selectedPrice,
          discordUserIdToPing
        );
        
        console.log("Sending Discord notification with user mention...");
        notificationSent = await sendDiscordWebhook(discordWebhookUrl, message);
      } else {
        console.error("Discord webhook URL is not configured");
      }
      
      // Simulate processing time (in a real app, this would be your payment processing)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (notificationSent) {
        toast({
          title: "Purchase processed",
          description: `You have purchased ${modTitle} (${selectedPrice}). A notification has been sent to our Discord.`,
        });
      } else {
        // Still allow purchase even if notification fails
        toast({
          title: "Purchase processed",
          description: `You have purchased ${modTitle} (${selectedPrice}). (Note: Discord notification could not be sent)`,
        });
      }
      
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your purchase. Please try again.",
        variant: "destructive",
      });
      console.error("Purchase error:", error);
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
