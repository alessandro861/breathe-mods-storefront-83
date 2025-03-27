
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
import { Search, UserCog, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getUsers, getUserProfile, getUserPurchases } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

export const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();
  const usersPerPage = 5;

  useEffect(() => {
    // Load users when component mounts
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getUsers();
    const enrichedUsers = allUsers.map(user => {
      const profile = getUserProfile(user.email);
      const purchases = getUserPurchases(user.email);
      
      return {
        id: user.email,
        name: profile?.displayName || profile?.username || user.email.split('@')[0],
        email: user.email,
        status: 'active', // In a real app, you'd have a user status field
        joinDate: new Date().toISOString(), // This would come from user registration date in a real app
        purchaseCount: purchases.length,
        profile: profile
      };
    });
    
    setUsers(enrichedUsers);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const toggleUserStatus = (userId: string) => {
    // This is a simplified implementation that would need to be completed
    // In a real app, you would update the user status in your database
    toast({
      title: "Status Updated",
      description: `User status has been toggled.`,
    });
    
    // Update the local state to reflect the change immediately
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {...user, status: user.status === 'active' ? 'inactive' : 'active'};
      }
      return user;
    }));
  };

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
              <TableHead>Purchases</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
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
                  <TableCell>{user.purchaseCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {user.status === 'active' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleUserStatus(user.id)}
                          title="Deactivate user"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleUserStatus(user.id)}
                          title="Activate user"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            )}
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
