
import React, { useState } from 'react';
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
import { Search, ShoppingCart, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Mock data for demonstration
const MOCK_PURCHASES = [
  { id: 1, user: 'John Doe', email: 'john@example.com', product: 'Premium Furniture Pack', amount: 49.99, date: '2023-08-15', status: 'completed' },
  { id: 2, user: 'Jane Smith', email: 'jane@example.com', product: 'Advanced Weapon Mod', amount: 29.99, date: '2023-09-02', status: 'completed' },
  { id: 3, user: 'David Miller', email: 'david@example.com', product: 'Deluxe Base Builder', amount: 59.99, date: '2023-09-10', status: 'completed' },
  { id: 4, user: 'Sarah Williams', email: 'sarah@example.com', product: 'Premium Furniture Pack', amount: 49.99, date: '2023-09-15', status: 'completed' },
  { id: 5, user: 'Jane Smith', email: 'jane@example.com', product: 'Vehicle Enhancement Kit', amount: 39.99, date: '2023-09-20', status: 'completed' },
  { id: 6, user: 'Robert Brown', email: 'robert@example.com', product: 'Terrain Modification Bundle', amount: 34.99, date: '2023-09-25', status: 'processing' },
  { id: 7, user: 'Jane Smith', email: 'jane@example.com', product: 'Character Customization Pack', amount: 19.99, date: '2023-09-28', status: 'processing' },
  { id: 8, user: 'David Miller', email: 'david@example.com', product: 'Lighting Effects Collection', amount: 24.99, date: '2023-10-01', status: 'completed' },
  { id: 9, user: 'John Doe', email: 'john@example.com', product: 'Security Systems Pack', amount: 44.99, date: '2023-10-05', status: 'completed' },
  { id: 10, user: 'Sarah Williams', email: 'sarah@example.com', product: 'Storage Solutions Bundle', amount: 29.99, date: '2023-10-10', status: 'processing' },
];

export const PurchaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const purchasesPerPage = 5;

  // Filter purchases based on search term
  const filteredPurchases = MOCK_PURCHASES.filter(purchase => 
    purchase.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    purchase.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = filteredPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);
  const totalPages = Math.ceil(filteredPurchases.length / purchasesPerPage);

  // Calculate total revenue
  const totalRevenue = filteredPurchases.reduce((total, purchase) => total + purchase.amount, 0);

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
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search purchases..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <Table>
          <TableCaption>Complete purchase history</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
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
                <TableCell className="font-medium">{purchase.user}</TableCell>
                <TableCell>{purchase.email}</TableCell>
                <TableCell>{purchase.product}</TableCell>
                <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {purchase.status === 'completed' ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                      Processing
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
      </div>
    </div>
  );
};
