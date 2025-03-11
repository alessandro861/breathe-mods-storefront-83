
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Ticket, TicketPlus, MessageSquare, Clock, CheckCircle2, TicketX, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sendDiscordWebhook } from '@/utils/discordIntegration';
import DiscordSettings from '@/components/mods/DiscordSettings';

// Schema for validation
const ticketSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  contactInfo: z.string().email({ message: "Please enter a valid email address" })
});

type TicketFormValues = z.infer<typeof ticketSchema>;

// Mock data for tickets
const mockTickets = [
  { id: 1, title: "Minecraft fly mod", status: "open", createdAt: "2023-05-15", lastUpdated: "2023-05-16" },
  { id: 2, title: "Skyrim combat overhaul", status: "pending", createdAt: "2023-05-10", lastUpdated: "2023-05-12" },
  { id: 3, title: "Fallout 4 graphics enhancer", status: "closed", createdAt: "2023-04-28", lastUpdated: "2023-05-05" },
];

const TicketSystem = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [isDiscordSettingsOpen, setIsDiscordSettingsOpen] = useState(false);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      contactInfo: ""
    }
  });

  useEffect(() => {
    // Load Discord webhook URL from localStorage
    const storedWebhookUrl = localStorage.getItem('discord-webhook-url');
    if (storedWebhookUrl) {
      setDiscordWebhookUrl(storedWebhookUrl);
    }
  }, []);

  const onSubmit = async (data: TicketFormValues) => {
    console.log("Ticket submitted:", data);
    
    // In a real application, you would send this data to a backend
    toast({
      title: "Ticket Created",
      description: "Your ticket has been submitted successfully. We'll get back to you soon.",
    });
    
    // Send Discord notification if webhook URL is configured
    if (discordWebhookUrl) {
      try {
        const ticketNotification = {
          content: "🎫 **New Support Ticket Created**",
          embeds: [
            {
              title: data.title,
              description: data.description,
              color: 3447003, // Blue color
              fields: [
                {
                  name: "Contact",
                  value: data.contactInfo,
                  inline: true
                },
                {
                  name: "Created At",
                  value: new Date().toLocaleString(),
                  inline: true
                }
              ],
              footer: {
                text: "Ticket System"
              }
            }
          ]
        };
        
        const success = await sendDiscordWebhook(discordWebhookUrl, ticketNotification);
        
        if (success) {
          console.log("Discord notification sent successfully");
        } else {
          console.error("Failed to send Discord notification");
          toast({
            title: "Discord Notification Failed",
            description: "The ticket was created, but we couldn't send a notification to Discord.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error sending Discord notification:", error);
      }
    }
    
    form.reset();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Open</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</span>;
      case 'closed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Closed</span>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto pb-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-shine">Ticket System</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Submit a ticket for mod requests, support, or other inquiries. We'll get back to you as soon as possible.
          </p>
          
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDiscordSettingsOpen(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Discord Notifications
            </Button>
          </div>
        </div>

        <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <TicketPlus className="h-4 w-4" /> Create Ticket
            </TabsTrigger>
            <TabsTrigger value="my-tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" /> My Tickets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Request for Skyrim combat mod" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a brief title for your ticket
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your request in detail, including the game name, what functionality you need, etc." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Be as detailed as possible to help us understand your request
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your-email@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          We'll use this to update you on your ticket
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" size="lg" className="w-full mt-6">
                    <TicketPlus className="mr-2 h-5 w-5" />
                    Submit Ticket
                  </Button>
                </form>
              </Form>
              
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <h3 className="text-lg font-medium mb-4">What happens next?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Our team will review your ticket and respond within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <MessageSquare className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span>You'll receive email updates for any changes to your ticket status</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <Clock className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <span>Complex requests may take longer to process</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="my-tickets">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              {mockTickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {mockTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{ticket.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{ticket.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(ticket.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.createdAt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.lastUpdated}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <Button size="sm" variant="ghost" className="text-blue-500 hover:text-blue-400">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TicketX className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No tickets found</h3>
                  <p className="text-gray-400 mb-6">You haven't created any tickets yet.</p>
                  <Button onClick={() => setActiveTab("create")} variant="outline">
                    Create Your First Ticket
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Discord Settings Dialog */}
      <DiscordSettings 
        isOpen={isDiscordSettingsOpen} 
        setIsOpen={setIsDiscordSettingsOpen} 
      />
    </Layout>
  );
};

export default TicketSystem;
