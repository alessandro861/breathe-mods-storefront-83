
import React, { useState, useEffect } from 'react';
import { 
  getDiscountCodes, 
  createDiscountCode, 
  toggleDiscountCodeStatus, 
  deleteDiscountCode,
  DiscountCode
} from '@/services/discountService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BadgePercent, Plus, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const DiscountManager: React.FC = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [percentage, setPercentage] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load discount codes on mount
  useEffect(() => {
    setDiscountCodes(getDiscountCodes());
  }, []);

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!newCode.trim()) {
        throw new Error('Please enter a discount code');
      }

      if (percentage <= 0 || percentage > 100) {
        throw new Error('Percentage must be between 1 and 100');
      }

      const code = createDiscountCode(newCode.toUpperCase(), percentage);
      setDiscountCodes([...discountCodes, code]);
      setNewCode('');
      setPercentage(10);

      toast({
        title: 'Discount code created',
        description: `Code ${code.code} with ${code.percentage}% discount has been created.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create discount code',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updatedCode = toggleDiscountCodeStatus(id);
    if (updatedCode) {
      setDiscountCodes(discountCodes.map(code => 
        code.id === id ? updatedCode : code
      ));
      
      toast({
        title: `Code ${updatedCode.active ? 'activated' : 'deactivated'}`,
        description: `Discount code ${updatedCode.code} has been ${updatedCode.active ? 'activated' : 'deactivated'}.`,
      });
    }
  };

  const handleDeleteCode = (id: string) => {
    const deleted = deleteDiscountCode(id);
    if (deleted) {
      setDiscountCodes(discountCodes.filter(code => code.id !== id));
      
      toast({
        title: 'Discount code deleted',
        description: 'The discount code has been permanently deleted.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-primary" />
            Create Discount Code
          </CardTitle>
          <CardDescription>
            Add a new discount code with a specified percentage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCode} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="code">Discount Code</Label>
                <Input
                  id="code"
                  placeholder="SUMMER2023"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">Discount Percentage</Label>
                <div className="flex items-center">
                  <Input
                    id="percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={percentage}
                    onChange={e => setPercentage(Number(e.target.value))}
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Code
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>
            Manage your existing discount codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {discountCodes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No discount codes created yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discountCodes.map(code => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono font-medium">{code.code}</TableCell>
                    <TableCell>{code.percentage}%</TableCell>
                    <TableCell>{formatDate(code.createdAt)}</TableCell>
                    <TableCell>{code.usedCount} times</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={code.active} 
                          onCheckedChange={() => handleToggleStatus(code.id)}
                        />
                        <span className={code.active ? "text-green-500" : "text-red-500"}>
                          {code.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCode(code.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
