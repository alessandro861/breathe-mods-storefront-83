
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LogOut, Shield } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const AdminLogin: React.FC = () => {
  const [code, setCode] = useState('');
  const [open, setOpen] = useState(false);
  const { isAdmin, login, logout } = useAdmin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(code)) {
      setOpen(false);
      setCode('');
    }
  };

  if (isAdmin) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
        onClick={logout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Admin Logout
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lock className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin Access
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="admin-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="password"
              placeholder="Enter admin code"
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
