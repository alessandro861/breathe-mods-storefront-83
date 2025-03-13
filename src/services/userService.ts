
export interface User {
  username?: string;
  email: string;
  password: string;
  ipAddress?: string;
  purchases?: Purchase[];
}

export interface Purchase {
  id: string;
  productName: string;
  date: string;
  price: number;
  serverIp?: string;
  serverName?: string;
  serverPort?: string;
}

// Retrieve users from localStorage
export const getUsers = (): User[] => {
  const usersString = localStorage.getItem('breathe-users');
  return usersString ? JSON.parse(usersString) : [];
};

// Save a new user
export const saveUser = (user: User): boolean => {
  try {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      return false;
    }
    
    users.push(user);
    localStorage.setItem('breathe-users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

// Validate login credentials
export const validateLogin = (email: string, password: string): boolean => {
  const users = getUsers();
  return users.some(user => user.email === email && user.password === password);
};

// Save current user session
export const saveUserSession = (email: string): void => {
  localStorage.setItem('breathe-current-user', email);
};

// Get current user session
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('breathe-current-user');
};

// Clear user session
export const clearUserSession = (): void => {
  localStorage.removeItem('breathe-current-user');
};

// Get user data by email
export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  return user || null;
};

// Update user data
export const updateUser = (email: string, userData: Partial<User>): boolean => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }
    
    users[userIndex] = { ...users[userIndex], ...userData };
    localStorage.setItem('breathe-users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// Add a purchase to user
export const addPurchase = (email: string, purchase: Purchase): boolean => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }
    
    if (!users[userIndex].purchases) {
      users[userIndex].purchases = [];
    }
    
    users[userIndex].purchases?.push(purchase);
    localStorage.setItem('breathe-users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error adding purchase:', error);
    return false;
  }
};

// Get user purchases
export const getUserPurchases = (email: string): Purchase[] => {
  const user = getUserByEmail(email);
  return user?.purchases || [];
};

// Update purchase
export const updatePurchase = (email: string, purchaseId: string, updatedData: Partial<Purchase>): boolean => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1 || !users[userIndex].purchases) {
      return false;
    }
    
    const purchaseIndex = users[userIndex].purchases?.findIndex(p => p.id === purchaseId);
    
    if (purchaseIndex === -1 || purchaseIndex === undefined) {
      return false;
    }
    
    // Update the purchase
    users[userIndex].purchases![purchaseIndex] = {
      ...users[userIndex].purchases![purchaseIndex],
      ...updatedData
    };
    
    localStorage.setItem('breathe-users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error updating purchase:', error);
    return false;
  }
};

// Mock method to add sample data for demonstration
export const addSampleData = (): void => {
  const sampleUsers: User[] = [
    {
      email: "user1@example.com",
      password: "password123",
      username: "User One",
      ipAddress: "192.168.1.101",
      purchases: [
        {
          id: "p1",
          productName: "Combat Mod Pack",
          date: "2023-06-15",
          price: 19.99,
          serverIp: "192.168.1.101",
          serverName: "My Awesome Server",
          serverPort: "30120"
        }
      ]
    },
    {
      email: "user2@example.com",
      password: "password123",
      username: "User Two",
      ipAddress: "192.168.1.102",
      purchases: [
        {
          id: "p2",
          productName: "Graphics Overhaul",
          date: "2023-07-22",
          price: 24.99,
          serverIp: "play.myserver.net",
          serverName: "Gaming Central",
          serverPort: "25565"
        },
        {
          id: "p3",
          productName: "Economy Mod",
          date: "2023-08-05",
          price: 14.99,
          serverIp: "play.myserver.net",
          serverName: "Gaming Central",
          serverPort: "25565"
        }
      ]
    }
  ];
  
  // Only add sample data if there are no users
  if (getUsers().length === 0) {
    localStorage.setItem('breathe-users', JSON.stringify(sampleUsers));
  }
};
