
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, getUserPurchases, Purchase } from '@/services/userService';
import { Edit, ShoppingBag, Server, ServerIcon } from 'lucide-react';
import PurchaseEditDialog from '@/components/purchases/PurchaseEditDialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const UserPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userEmail = getCurrentUser();
    
    if (!userEmail) {
      toast({
        title: "Not logged in",
        description: "Please log in to view your purchases",
        variant: "destructive",
      });
      navigate('/login', { state: { redirectTo: '/purchases' } });
      return;
    }
    
    // Load purchases from user data
    const userPurchases = getUserPurchases(userEmail);
    setPurchases(userPurchases);
    setIsLoading(false);
  }, [navigate, toast]);

  const openEditDialog = (purchase: Purchase) => {
    setCurrentPurchase(purchase);
    setIsDialogOpen(true);
  };

  // Handle purchase update in the UI after edit
  const handlePurchaseUpdated = (updatedPurchase: Purchase) => {
    setPurchases(prevPurchases => 
      prevPurchases.map(p => 
        p.id === updatedPurchase.id ? updatedPurchase : p
      )
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <p className="text-center text-muted-foreground">Loading your purchases...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          Your Purchases & Whitelists
        </h1>
        
        {purchases.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h3 className="font-medium text-lg mb-2">No purchases yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any purchases yet. Check out our paid mods!
                </p>
                <Button onClick={() => navigate('/paid-mods')}>
                  Browse Paid Mods
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>{purchase.productName}</CardTitle>
                    <Badge variant="outline" className="px-2 py-1 border-primary/30 bg-primary/10">
                      {purchase.secondServerName ? "2/2 Whitelists" : "1/2 Whitelists"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <span>Purchased: {purchase.date}</span>
                    <span>•</span>
                    <span>${purchase.price.toFixed(2)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Primary Whitelist */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <ServerIcon className="h-4 w-4 text-primary" />
                          Primary Whitelist
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-border rounded-md">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Server Name</p>
                          <p className="font-medium">{purchase.serverName || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Server IP</p>
                          <p className="font-medium">{purchase.serverIp || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Server Port</p>
                          <p className="font-medium">{purchase.serverPort || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Secondary Whitelist (if exists) */}
                    {purchase.secondServerName && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium flex items-center gap-2">
                            <ServerIcon className="h-4 w-4 text-primary" />
                            Secondary Whitelist
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-border rounded-md">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Server Name</p>
                            <p className="font-medium">{purchase.secondServerName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Server IP</p>
                            <p className="font-medium">{purchase.secondServerIp}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Server Port</p>
                            <p className="font-medium">{purchase.secondServerPort}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="ml-auto flex items-center gap-2"
                    onClick={() => openEditDialog(purchase)}
                  >
                    <Edit className="h-4 w-4" />
                    {purchase.secondServerName 
                      ? "Edit Whitelists" 
                      : "Manage Whitelists"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {currentPurchase && (
          <PurchaseEditDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            purchase={currentPurchase}
            onPurchaseUpdated={handlePurchaseUpdated}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserPurchases;
