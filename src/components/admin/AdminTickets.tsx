
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
import { Search, MessageSquare, UserX, CheckCircle2, AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TicketChat from '../tickets/TicketChat';
import { TicketPriority } from '../tickets/TicketChat';

// Mock data interface for tickets
export interface AdminTicket {
  id: number;
  title: string;
  status: 'open' | 'pending' | 'closed';
  priority: TicketPriority;
  createdAt: string;
  lastUpdated: string;
  userEmail: string;
  messages: TicketMessage[];
}

// Message type for ticket chats
export interface TicketMessage {
  id: number;
  content: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

export const AdminTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [allTickets, setAllTickets] = useState<AdminTicket[]>([]);
  const { toast } = useToast();
  const ticketsPerPage = 5;

  // Load tickets from localStorage on component mount
  useEffect(() => {
    const loadTickets = () => {
      try {
        const ticketsString = localStorage.getItem('breathe-tickets');
        if (ticketsString) {
          const tickets = JSON.parse(ticketsString);
          // Ensure all tickets have valid status and priority
          const validatedTickets = tickets.map((ticket: any) => ({
            ...ticket,
            status: ['open', 'pending', 'closed'].includes(ticket.status) ? ticket.status : 'open' as const,
            priority: ['low', 'normal', 'high'].includes(ticket.priority) ? ticket.priority : 'normal' as TicketPriority
          }));
          setAllTickets(validatedTickets as AdminTicket[]);
        }
      } catch (error) {
        console.error('Error loading tickets:', error);
      }
    };

    loadTickets();
  }, []);

  // Filter tickets based on search term
  const filteredTickets = allTickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open':
        return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Open</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Pending</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">Closed</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch(priority) {
      case 'low':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Low
          </Badge>
        );
      case 'normal':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Normal
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 flex items-center gap-1">
            <AlertOctagon className="h-3 w-3" />
            High
          </Badge>
        );
      default:
        return null;
    }
  };

  const openTicketChat = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);
    setIsChatOpen(true);
  };

  const updateTicketStatus = (ticketId: number, newStatus: 'open' | 'pending' | 'closed') => {
    const updatedTickets = allTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return ticket;
    });
    
    setAllTickets(updatedTickets);
    localStorage.setItem('breathe-tickets', JSON.stringify(updatedTickets));
    
    const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    toast({
      title: `Ticket Status Updated`,
      description: `Ticket #${ticketId} has been marked as ${statusText}`,
    });
    
    // If the current ticket is open in the chat, update it
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
  };

  const updateTicketPriority = (ticketId: number, newPriority: TicketPriority) => {
    const updatedTickets = allTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          priority: newPriority,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return ticket;
    });
    
    setAllTickets(updatedTickets);
    localStorage.setItem('breathe-tickets', JSON.stringify(updatedTickets));
    
    const priorityText = newPriority.charAt(0).toUpperCase() + newPriority.slice(1);
    toast({
      title: `Ticket Priority Updated`,
      description: `Ticket #${ticketId} priority set to ${priorityText}`,
    });
    
    // If the current ticket is open in the chat, update it
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        priority: newPriority,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim() || !selectedTicket) return;
    
    const newMsg: TicketMessage = {
      id: selectedTicket.messages.length + 1,
      content: message,
      sender: "admin",
      timestamp: new Date().toLocaleString()
    };
    
    // Update the ticket with the new message
    const updatedTickets = allTickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMsg],
          lastUpdated: new Date().toISOString().split('T')[0],
          status: 'pending' as const
        };
      }
      return ticket;
    });
    
    setAllTickets(updatedTickets);
    localStorage.setItem('breathe-tickets', JSON.stringify(updatedTickets));
    
    // Update the selected ticket with the new message
    const updatedSelectedTicket = updatedTickets.find(t => t.id === selectedTicket.id);
    if (updatedSelectedTicket) {
      setSelectedTicket(updatedSelectedTicket);
    }
    
    toast({
      title: "Response Sent",
      description: "Your response has been sent to the user.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2 h-6 w-6" />
          All Support Tickets
        </h2>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search tickets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        {allTickets.length > 0 ? (
          <Table>
            <TableCaption>All support tickets from users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">#{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.userEmail}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell>{ticket.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-blue-400"
                        onClick={() => openTicketChat(ticket)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      
                      {ticket.status !== 'closed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                          onClick={() => updateTicketStatus(ticket.id, 'closed')}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {ticket.status !== 'open' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-400 border-green-500/20 hover:bg-green-500/10"
                          onClick={() => updateTicketStatus(ticket.id, 'open')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No tickets found</h3>
            <p className="text-gray-400">There are no support tickets in the system.</p>
          </div>
        )}
        
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

      {/* Ticket Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-shine">
              Ticket #{selectedTicket?.id}: {selectedTicket?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(selectedTicket?.status || 'open')} 
                {getPriorityBadge(selectedTicket?.priority || 'normal')}
                <span className="text-gray-300 text-sm">
                  From: {selectedTicket?.userEmail}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-400">Priority:</span>
                <Select 
                  defaultValue={selectedTicket.priority} 
                  onValueChange={(value) => updateTicketPriority(selectedTicket.id, value as TicketPriority)}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TicketChat
                messages={selectedTicket.messages}
                onSendMessage={handleSendMessage}
                isTicketClosed={selectedTicket.status === 'closed'}
              />
            </>
          )}

          <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateTicketStatus(selectedTicket?.id || 0, 'closed')}
              disabled={!selectedTicket || selectedTicket.status === 'closed'}
              className="text-red-400 border-red-500/20 hover:bg-red-500/10"
            >
              <UserX className="mr-2 h-4 w-4" />
              Close Ticket
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateTicketStatus(selectedTicket?.id || 0, 'open')}
              disabled={!selectedTicket || selectedTicket.status === 'open'}
              className="text-green-400 border-green-500/20 hover:bg-green-500/10"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Open
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
