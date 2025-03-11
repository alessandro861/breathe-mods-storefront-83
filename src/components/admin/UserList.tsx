
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
import { Search, UserCog, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Mock data for demonstration
const MOCK_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2023-05-12', purchaseCount: 3 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2023-06-18', purchaseCount: 5 },
  { id: 3, name: 'Michael Johnson', email: 'michael@example.com', status: 'inactive', joinDate: '2023-04-22', purchaseCount: 0 },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', status: 'active', joinDate: '2023-07-05', purchaseCount: 2 },
  { id: 5, name: 'Robert Brown', email: 'robert@example.com', status: 'active', joinDate: '2023-08-30', purchaseCount: 1 },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', status: 'inactive', joinDate: '2023-03-15', purchaseCount: 0 },
  { id: 7, name: 'David Miller', email: 'david@example.com', status: 'active', joinDate: '2023-09-10', purchaseCount: 4 },
];

export const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filter users based on search term
  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <UserCog className="mr-2 h-6 w-6" />
          User Management
        </h2>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <Table>
          <TableCaption>List of registered users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Purchases</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>{user.purchaseCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-400 border-red-500/20 hover:bg-red-500/10">
                      <UserX className="h-4 w-4" />
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
