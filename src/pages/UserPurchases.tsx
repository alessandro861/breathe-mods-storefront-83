
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
import { Edit, ShoppingBag } from 'lucide-react';
import PurchaseEditDialog from '@/components/purchases/PurchaseEditDialog';

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
          Your Purchases
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
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                View and manage all your purchases. You can edit server details if needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.productName}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>${purchase.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{purchase.serverName || 'N/A'}</p>
                          <p className="text-muted-foreground">
                            {purchase.serverIp}:{purchase.serverPort}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(purchase)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
