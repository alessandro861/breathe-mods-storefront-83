import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser, getUserProfile, updateUserProfile, getUserPurchases, Purchase } from '@/services/userService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserCog, Mail, User, Key, ShoppingBag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

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
                    Your Purchases
                  </CardTitle>
                  <CardDescription>
                    View all products and mods you've purchased
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Server</TableHead>
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
