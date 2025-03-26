
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
import { Shield, Send, Flag, DollarSign, AtSign, Server, Globe, Plug, BadgePercent } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createDiscordPurchaseMessage, sendDiscordWebhook } from '@/utils/discordIntegration';
import { getCurrentUser, addPurchase } from '@/services/userService';
import { validateDiscountCode } from '@/services/discountService';
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
  discountCode: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

interface PurchaseDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modTitle: string;
  modPrice: string;
}

const PurchaseDialogWithDiscount: React.FC<PurchaseDialogProps> = ({
  isOpen,
  setIsOpen,
  modTitle,
  modPrice
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountApplied, setDiscountApplied] = useState<number | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number>(45);
  const [finalPrice, setFinalPrice] = useState<number>(45);
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
      
      // Reset discount and price
      setDiscountApplied(null);
      
      // Set initial price based on mod
      const basePrice = modTitle === "Capture Flag" ? 45 : extractPriceFromString(modPrice);
      setOriginalPrice(basePrice);
      setFinalPrice(basePrice);
      
      form.reset({
        discordUsername: "",
        serverName: "",
        serverIP: "",
        serverPort: "",
        priceOption: "basic",
        discountCode: "",
      });
    }
  }, [isOpen, modTitle, modPrice]);

  // Helper function to extract price from string like "45€" or "65€"
  const extractPriceFromString = (priceString: string): number => {
    const match = priceString.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 45;
  };

  // Initialize form with validation
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      discordUsername: "",
      serverName: "",
      serverIP: "",
      serverPort: "",
      priceOption: "basic",
      discountCode: "",
    },
  });

  // Update price when price option changes
  useEffect(() => {
    const priceOption = form.watch("priceOption");
    const newBasePrice = priceOption === 'basic' ? 45 : 65;
    setOriginalPrice(newBasePrice);
    
    // Apply existing discount if there is one
    if (discountApplied !== null) {
      const discountAmount = (newBasePrice * discountApplied) / 100;
      setFinalPrice(newBasePrice - discountAmount);
    } else {
      setFinalPrice(newBasePrice);
    }
  }, [form.watch("priceOption"), discountApplied]);

  // Function to apply discount code
  const applyDiscountCode = () => {
    const discountCode = form.getValues("discountCode");
    
    if (!discountCode || discountCode.trim() === '') {
      toast({
        title: "No discount code entered",
        description: "Please enter a discount code to apply.",
        variant: "destructive",
      });
      return;
    }
    
    const validationResult = validateDiscountCode(discountCode.toUpperCase());
    
    if (!validationResult) {
      toast({
        title: "Invalid discount code",
        description: "The discount code you entered is invalid or inactive.",
        variant: "destructive",
      });
      return;
    }
    
    // Apply the discount
    setDiscountApplied(validationResult.percentage);
    const discountAmount = (originalPrice * validationResult.percentage) / 100;
    setFinalPrice(originalPrice - discountAmount);
    
    toast({
      title: "Discount applied!",
      description: `${validationResult.percentage}% discount applied to your purchase.`,
    });
  };

  const onSubmit = async (data: PurchaseFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Determine the price based on the selected option and discount
      const selectedPriceText = data.priceOption === 'basic' ? '45€' : '65€ (with EMP)';
      let selectedPrice = data.priceOption === 'basic' ? 45 : 65;
      
      // Apply discount if available
      if (discountApplied !== null) {
        selectedPrice = finalPrice;
      }
      
      // Format the price for display
      const finalPriceText = `${selectedPrice}€${discountApplied ? ` (${discountApplied}% discount applied)` : ''}`;
      
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
      }
      
      // Try to send Discord notification
      if (discordWebhookUrl) {
        // Create message with mention and all the fields
        const message = createDiscordPurchaseMessage(
          modTitle,
          data.discordUsername,
          data.serverName,
          data.serverIP,
          data.serverPort,
          finalPriceText,
          discordUserIdToPing
        );
        
        // Send notification - await the result
        const notificationSent = await sendDiscordWebhook(discordWebhookUrl, message);
        
        if (!notificationSent) {
          console.error("[Purchase] Failed to send notification to Discord");
        }
      }
      
      // Simulate processing time (in a real app, this would be your payment processing)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Purchase processed",
        description: userEmail 
          ? `You have purchased ${modTitle} (${finalPriceText}). You can view and manage this purchase in your account.`
          : `You have purchased ${modTitle} (${finalPriceText}). Create an account to manage your purchases.`,
        duration: 5000
      });
      
      form.reset();
      setIsOpen(false);
      setDiscountApplied(null);
      
      // If the user is logged in, suggest navigating to their purchases
      if (userEmail) {
        setTimeout(() => {
          toast({
            title: "View your purchases",
            description: "Would you like to view and manage your purchases?",
            action: (
              <Button variant="outline" onClick={() => navigate('/purchases')}>
                Go to Purchases
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
                  <span>Base Price:</span>
                  <span dangerouslySetInnerHTML={{ __html: modPrice }}></span>
                </div>
              </div>
            )}
            
            {/* Discount Code Section */}
            <FormField
              control={form.control}
              name="discountCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <BadgePercent className="h-4 w-4 text-muted-foreground" />
                    Discount Code
                  </FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input 
                        placeholder="Enter code" 
                        {...field} 
                        className="uppercase"
                        disabled={discountApplied !== null}
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={applyDiscountCode}
                      disabled={discountApplied !== null}
                    >
                      Apply
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Display final price */}
            <div className={`p-3 rounded-md ${discountApplied ? 'bg-green-500/10 border border-green-300/30' : 'bg-primary/10'}`}>
              <div className="flex justify-between font-medium">
                <span>Final Price:</span>
                <span className="font-bold">{finalPrice}€</span>
              </div>
              {discountApplied && (
                <div className="text-sm text-green-600 mt-1 flex justify-between">
                  <span>Discount applied:</span>
                  <span>{discountApplied}% OFF</span>
                </div>
              )}
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsOpen(false);
                  setDiscountApplied(null);
                }}
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

export default PurchaseDialogWithDiscount;
