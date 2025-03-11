
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from '@/components/admin/UserList';
import { PurchaseHistory } from '@/components/admin/PurchaseHistory';
import { AdminTickets } from '@/components/admin/AdminTickets';
import WebhookSettings from '@/components/admin/WebhookSettings';
import { useAdmin } from '@/hooks/useAdmin';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Ticket, BellRing } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { addSampleData } from '@/services/userService';

const AdminPage = () => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8"
      >
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400 mb-6">Manage accounts and view purchases</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => {
                  addSampleData();
                  window.location.reload();
                }}
                className="flex items-center gap-2"
              >
                Add Sample Data
              </Button>
            </div>
          </div>

          <Tabs defaultValue="manage-accounts" className="w-full">
            <TabsList className="mb-6 bg-background/50 backdrop-blur-sm border border-white/10">
              <TabsTrigger value="manage-accounts">Manage Accounts</TabsTrigger>
              <TabsTrigger value="purchases">Purchase History</TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-1">
                <Ticket className="h-4 w-4" />
                Support Tickets
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center gap-1">
                <BellRing className="h-4 w-4" />
                Webhook Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manage-accounts" className="space-y-4">
              <UserList />
            </TabsContent>
            
            <TabsContent value="purchases" className="space-y-4">
              <PurchaseHistory />
            </TabsContent>
            
            <TabsContent value="tickets" className="space-y-4">
              <AdminTickets />
            </TabsContent>
            
            <TabsContent value="webhooks" className="space-y-4">
              <WebhookSettings />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdminPage;
