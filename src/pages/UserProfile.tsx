import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser, getUserProfile, updateUserProfile, getUserPurchases, Purchase, updateWhitelistForPurchase } from '@/services/userService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserCog, Mail, User, Key, ShoppingBag, ServerIcon, Edit, Plus, Save, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    email: '',
    username: '',
    displayName: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<string | null>(null);
  const [secondWhitelistMode, setSecondWhitelistMode] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Temporary state for editing purchase whitelists
  const [editedWhitelist, setEditedWhitelist] = useState({
    serverName: '',
    serverIp: '',
    serverPort: '',
  });
  
  // State for second whitelist data
  const [secondWhitelist, setSecondWhitelist] = useState({
    serverName: '',
    serverIp: '',
    serverPort: '',
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const userProfile = getUserProfile(currentUser);
    if (userProfile) {
      setProfile({
        email: currentUser,
        username: userProfile.username || '',
        displayName: userProfile.displayName || '',
        avatar: userProfile.avatar || '',
      });
    } else {
      setProfile({
        email: currentUser,
        username: '',
        displayName: '',
        avatar: '',
      });
    }

    // Fetch user purchases
    const userPurchases = getUserPurchases(currentUser);
    setPurchases(userPurchases);
  }, [currentUser, navigate]);

  const handleProfileUpdate = () => {
    if (updateUserProfile(currentUser, {
      username: profile.username,
      displayName: profile.displayName,
      avatar: profile.avatar,
    })) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = () => {
    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    // This is a simplified implementation that would need to be completed with actual password verification
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  // Start editing a purchase whitelist
  const startEditingPurchase = (purchaseId: string) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    if (purchase) {
      setEditedWhitelist({
        serverName: purchase.serverName || '',
        serverIp: purchase.serverIp || '',
        serverPort: purchase.serverPort || '',
      });
      setEditingPurchase(purchaseId);
    }
  };

  // Start adding a second whitelist to a purchase
  const startAddingSecondWhitelist = (purchaseId: string) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    if (purchase) {
      setSecondWhitelist({
        serverName: purchase.secondServerName || '',
        serverIp: purchase.secondServerIp || '',
        serverPort: purchase.secondServerPort || '',
      });
      setSecondWhitelistMode(purchaseId);
    }
  };

  // Save whitelist changes
  const saveWhitelistChanges = (purchaseId: string, isSecondWhitelist: boolean = false) => {
    // Update the purchase with new whitelist information
    const updatedPurchase = updateWhitelistForPurchase(
      currentUser,
      purchaseId,
      isSecondWhitelist ? secondWhitelist : editedWhitelist,
      isSecondWhitelist
    );

    if (updatedPurchase) {
      // Update the local state to reflect changes
      setPurchases(prevPurchases => 
        prevPurchases.map(p => p.id === purchaseId ? updatedPurchase : p)
      );

      toast({
        title: `${isSecondWhitelist ? 'Second whitelist' : 'Whitelist'} updated`,
        description: `Your server details have been successfully updated.`,
      });

      // Close the editing mode
      if (isSecondWhitelist) {
        setSecondWhitelistMode(null);
      } else {
        setEditingPurchase(null);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to update whitelist information. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancel whitelist editing
  const cancelWhitelistEditing = (isSecondWhitelist: boolean = false) => {
    if (isSecondWhitelist) {
      setSecondWhitelistMode(null);
    } else {
      setEditingPurchase(null);
    }
  };

  if (!currentUser) {
    return null;
  }

  const getInitials = () => {
    if (profile.displayName) {
      return profile.displayName.charAt(0).toUpperCase();
    }
    if (profile.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return profile.email.charAt(0).toUpperCase();
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8"
      >
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">User Profile</h1>
              <p className="text-gray-400 mb-6">Manage your account information</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-black/30 backdrop-blur-sm border border-white/10 mb-6">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="purchases" className="data-[state=active]:bg-primary/20">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Purchases
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Avatar and Basic Info Card */}
                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Your profile details and avatar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center pt-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={profile.avatar} alt={profile.displayName || profile.username || profile.email} />
                      <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center space-y-1 mb-4">
                      <h3 className="text-xl font-medium">{profile.displayName || profile.username || "No name set"}</h3>
                      <p className="text-gray-400 flex items-center justify-center gap-1">
                        <Mail className="h-4 w-4" /> {profile.email}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-6">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  </CardFooter>
                </Card>

                {/* Edit Profile Card */}
                <Card className="bg-black/30 backdrop-blur-sm border border-white/10 md:col-span-2">
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>
                      Manage your profile information and password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <div className="flex items-center rounded-md border px-3">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="username"
                              value={profile.username}
                              onChange={(e) => setProfile({...profile, username: e.target.value})}
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your username"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <div className="flex items-center rounded-md border px-3">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="displayName"
                              value={profile.displayName}
                              onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your display name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <div className="flex items-center rounded-md border px-3">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="avatar"
                              value={profile.avatar}
                              onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your avatar URL"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleProfileUpdate}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : isChangingPassword ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="flex items-center rounded-md border px-3">
                            <Key className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your current password"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="flex items-center rounded-md border px-3">
                            <Key className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your new password"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="flex items-center rounded-md border px-3">
                            <Key className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Confirm your new password"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handlePasswordChange}>
                            Update Password
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">Profile Information</h3>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Email</p>
                              <p>{profile.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Username</p>
                              <p>{profile.username || "Not set"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Display Name</p>
                              <p>{profile.displayName || "Not set"}</p>
                            </div>
                          </div>
                          <div className="pt-2">
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                              Edit Information
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">Security</h3>
                          <Separator />
                          <div>
                            <p className="text-sm text-gray-400">Password</p>
                            <p>••••••••</p>
                          </div>
                          <div className="pt-2">
                            <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                              Change Password
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="purchases" className="space-y-6">
              <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Your Purchases & Whitelists
                  </CardTitle>
                  <CardDescription>
                    View and manage your purchases and server whitelists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchases.length === 0 ? (
                    <div className="text-center py-10">
                      <h3 className="font-medium text-lg mb-2">No purchases yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't made any purchases yet. Check out our paid mods!
                      </p>
                      <Button onClick={() => navigate('/paid-mods')}>
                        Browse Paid Mods
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {purchases.map((purchase) => (
                        <div key={purchase.id} className="border border-border rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium mb-1">{purchase.productName}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Purchased: {purchase.date}</span>
                                <span>•</span>
                                <span>${purchase.price.toFixed(2)}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="px-2 py-1 border-primary/30 bg-primary/10">
                              {purchase.secondServerName ? "2/2 Whitelists" : "1/2 Whitelists"}
                            </Badge>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          {/* Primary Whitelist */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium flex items-center gap-1">
                                <ServerIcon className="h-4 w-4 text-primary" /> 
                                Primary Whitelist
                              </h4>
                              {!editingPurchase && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => startEditingPurchase(purchase.id)}
                                  className="h-8"
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                </Button>
                              )}
                            </div>
                            
                            {editingPurchase === purchase.id ? (
                              <div className="space-y-3 border border-primary/20 rounded-md p-3 bg-primary/5">
                                <div className="space-y-1">
                                  <Label htmlFor={`server-name-${purchase.id}`}>Server Name</Label>
                                  <Input
                                    id={`server-name-${purchase.id}`}
                                    value={editedWhitelist.serverName}
                                    onChange={(e) => setEditedWhitelist({...editedWhitelist, serverName: e.target.value})}
                                    placeholder="Enter server name"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`server-ip-${purchase.id}`}>Server IP</Label>
                                  <Input
                                    id={`server-ip-${purchase.id}`}
                                    value={editedWhitelist.serverIp}
                                    onChange={(e) => setEditedWhitelist({...editedWhitelist, serverIp: e.target.value})}
                                    placeholder="Enter server IP"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`server-port-${purchase.id}`}>Server Port</Label>
                                  <Input
                                    id={`server-port-${purchase.id}`}
                                    value={editedWhitelist.serverPort}
                                    onChange={(e) => setEditedWhitelist({...editedWhitelist, serverPort: e.target.value})}
                                    placeholder="Enter server port"
                                  />
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => cancelWhitelistEditing()}
                                    className="h-8"
                                  >
                                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={() => saveWhitelistChanges(purchase.id)}
                                    className="h-8"
                                  >
                                    <Save className="h-3.5 w-3.5 mr-1" /> Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-border rounded-md p-3">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Server Name</p>
                                  <p className="font-medium">{purchase.serverName || "Not set"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Server IP</p>
                                  <p className="font-medium">{purchase.serverIp || "Not set"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Server Port</p>
                                  <p className="font-medium">{purchase.serverPort || "Not set"}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Secondary Whitelist */}
                          <div className="space-y-3 mt-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium flex items-center gap-1">
                                <ServerIcon className="h-4 w-4 text-primary" /> 
                                Secondary Whitelist
                              </h4>
                              {!purchase.secondServerName && !secondWhitelistMode && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => startAddingSecondWhitelist(purchase.id)}
                                  className="h-8"
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Second Whitelist
                                </Button>
                              )}
                              {purchase.secondServerName && !secondWhitelistMode && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => startAddingSecondWhitelist(purchase.id)}
                                  className="h-8"
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                </Button>
                              )}
                            </div>
                            
                            {secondWhitelistMode === purchase.id ? (
                              <div className="space-y-3 border border-primary/20 rounded-md p-3 bg-primary/5">
                                <div className="space-y-1">
                                  <Label htmlFor={`second-server-name-${purchase.id}`}>Server Name</Label>
                                  <Input
                                    id={`second-server-name-${purchase.id}`}
                                    value={secondWhitelist.serverName}
                                    onChange={(e) => setSecondWhitelist({...secondWhitelist, serverName: e.target.value})}
                                    placeholder="Enter server name"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`second-server-ip-${purchase.id}`}>Server IP</Label>
                                  <Input
                                    id={`second-server-ip-${purchase.id}`}
                                    value={secondWhitelist.serverIp}
                                    onChange={(e) => setSecondWhitelist({...secondWhitelist, serverIp: e.target.value})}
                                    placeholder="Enter server IP"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`second-server-port-${purchase.id}`}>Server Port</Label>
                                  <Input
                                    id={`second-server-port-${purchase.id}`}
                                    value={secondWhitelist.serverPort}
                                    onChange={(e) => setSecondWhitelist({...secondWhitelist, serverPort: e.target.value})}
                                    placeholder="Enter server port"
                                  />
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => cancelWhitelistEditing(true)}
                                    className="h-8"
                                  >
                                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={() => saveWhitelistChanges(purchase.id, true)}
                                    className="h-8"
                                  >
                                    <Save className="h-3.5 w-3.5 mr-1" /> Save
                                  </Button>
                                </div>
                              </div>
                            ) : purchase.secondServerName ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-border rounded-md p-3">
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
                            ) : (
                              <div className="border border-dashed border-border rounded-md p-4 text-center text-muted-foreground">
                                No secondary whitelist configured yet
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => navigate('/purchases')} className="ml-auto">
                    View All Purchases
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </Layout>
  );
};

export default UserProfile;
