export interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
}

export interface Purchase {
  id: string;
  productName: string;
  date: string;
  price: number;
  serverName?: string;
  serverIp?: string;
  serverPort?: string;
  secondServerName?: string;
  secondServerIp?: string;
  secondServerPort?: string;
}

export const getCurrentUser = (): string | null => {
  return localStorage.getItem('currentUser');
};

export const getUserProfile = (email: string): UserProfile | null => {
  const usersData = localStorage.getItem('users');

  if (usersData) {
    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.email === email);
    if (user) {
      return {
        username: user.username || '',
        displayName: user.displayName || '',
        avatar: user.avatar || '',
      };
    }
  }

  return null;
};

export const updateUserProfile = (email: string, profileData: UserProfile): boolean => {
  const usersData = localStorage.getItem('users');

  if (usersData) {
    const users = JSON.parse(usersData);
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profileData };
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
  }

  return false;
};

export const getUserPurchases = (email: string): Purchase[] => {
  const usersData = localStorage.getItem('users');
  if (usersData) {
    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.email === email);
    if (user && user.purchases) {
      return user.purchases;
    }
  }
  return [];
};

export const addPurchase = (email: string, purchaseData: Purchase): boolean => {
  const usersData = localStorage.getItem('users');
  if (usersData) {
    const users = JSON.parse(usersData);
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex !== -1) {
      if (!users[userIndex].purchases) {
        users[userIndex].purchases = [];
      }
      users[userIndex].purchases.push(purchaseData);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
  }
  return false;
};

export const updatePurchase = (email: string, purchaseId: string, purchaseData: Partial<Purchase>): boolean => {
  const usersData = localStorage.getItem('users');
  if (!usersData) return false;

  const users = JSON.parse(usersData);
  const user = users.find((u: any) => u.email === email);

  if (!user || !user.purchases) return false;

  const purchaseIndex = user.purchases.findIndex((p: Purchase) => p.id === purchaseId);
  if (purchaseIndex === -1) return false;

  user.purchases[purchaseIndex] = { ...user.purchases[purchaseIndex], ...purchaseData };
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};

export const updateWhitelistForPurchase = (
  userEmail: string,
  purchaseId: string,
  whitelistData: {
    serverName: string;
    serverIp: string;
    serverPort: string;
  },
  isSecondWhitelist: boolean = false
): Purchase | null => {
  try {
    // Get the user data from localStorage
    const usersData = localStorage.getItem('users');
    if (!usersData) return null;
    
    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.email === userEmail);
    
    if (!user || !user.purchases) return null;
    
    // Find the purchase to update
    const purchaseIndex = user.purchases.findIndex((p: Purchase) => p.id === purchaseId);
    if (purchaseIndex === -1) return null;
    
    // Update the purchase with the new whitelist information
    if (isSecondWhitelist) {
      user.purchases[purchaseIndex] = {
        ...user.purchases[purchaseIndex],
        secondServerName: whitelistData.serverName,
        secondServerIp: whitelistData.serverIp,
        secondServerPort: whitelistData.serverPort
      };
    } else {
      user.purchases[purchaseIndex] = {
        ...user.purchases[purchaseIndex],
        serverName: whitelistData.serverName,
        serverIp: whitelistData.serverIp,
        serverPort: whitelistData.serverPort
      };
    }
    
    // Save the updated data back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    return user.purchases[purchaseIndex];
  } catch (error) {
    console.error('Error updating whitelist:', error);
    return null;
  }
};
