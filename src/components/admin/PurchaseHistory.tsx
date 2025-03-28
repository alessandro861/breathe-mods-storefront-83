
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, FileText, Download, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getAllPurchases, resetAllPurchases, Purchase } from '@/services/purchaseService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export const PurchaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const purchasesPerPage = 5;
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setPurchases(getAllPurchases());
  }, []);

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(purchase => 
    purchase.modName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (purchase.productName && purchase.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    purchase.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = filteredPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);
  const totalPages = Math.ceil(filteredPurchases.length / purchasesPerPage);

  // Calculate total revenue
  const totalRevenue = filteredPurchases.reduce((total, purchase) => total + purchase.price, 0);

  const handleResetPurchases = () => {
    resetAllPurchases();
    setPurchases([]);
    setIsDialogOpen(false);
    toast({
      title: "Purchase history reset",
      description: "All purchase records have been cleared successfully.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" />
            Purchase History
          </h2>
          <p className="text-sm text-muted-foreground">
            Total Revenue: ${totalRevenue.toFixed(2)}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search purchases..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-1">
                <RefreshCcw className="h-4 w-4" />
                Reset History
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Purchase History</DialogTitle>
                <DialogDescription>
                  This action will permanently delete all purchase records. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">All purchase data will be permanently deleted.</p>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleResetPurchases}>
                  Reset All Purchases
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        {purchases.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No purchase records found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>Complete purchase history</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.userId.slice(0, 8)}...</TableCell>
                    <TableCell>{purchase.modName || purchase.productName}</TableCell>
                    <TableCell>${purchase.price.toFixed(2)}</TableCell>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {purchase.status === 'completed' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                          Completed
                        </Badge>
                      ) : purchase.status === 'pending' ? (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};
