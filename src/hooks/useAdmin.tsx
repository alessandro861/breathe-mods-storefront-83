
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './use-toast';

type AdminContextType = {
  isAdmin: boolean;
  login: (code: string) => boolean;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  // Check local storage on mount
  useEffect(() => {
    const adminStatus = localStorage.getItem('breathe-admin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (code: string): boolean => {
    if (code === 'ADMIN1234!') {
      setIsAdmin(true);
      localStorage.setItem('breathe-admin', 'true');
      toast({
        title: "Admin access granted",
        description: "You now have administrative privileges",
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Invalid admin code",
        description: "The code you entered is incorrect",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('breathe-admin');
    toast({
      title: "Logged out",
      description: "Admin session ended",
      variant: "default",
    });
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
