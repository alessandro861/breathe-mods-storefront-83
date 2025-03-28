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

// User data interfaces
interface User {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  avatar?: string;
  purchases?: Purchase[];
  otpCode?: string;
  otpExpiry?: number;
  resetToken?: string;
  resetTokenExpiry?: number;
}

// Add sample data for demonstration
export const addSampleData = (): void => {
  const existingUsers = localStorage.getItem('users');
  
  // Only add sample data if users don't exist yet
  if (!existingUsers) {
    const sampleUsers: User[] = [
      {
        email: 'user@example.com',
        username: 'demouser',
        password: 'Password123',
        displayName: 'Demo User',
        avatar: '',
        purchases: [
          {
            id: 'p1234567890',
            productName: 'Capture Flag',
            date: '2023-10-15',
            price: 45,
            serverName: 'Demo Server',
            serverIp: '192.168.1.1',
            serverPort: '30120'
          },
          {
            id: 'p2345678901',
            productName: 'Advanced Whitelist',
            date: '2023-11-20',
            price: 35,
            serverName: 'My RP Server',
            serverIp: '10.0.0.1',
            serverPort: '30120',
            secondServerName: 'Test Server',
            secondServerIp: '10.0.0.2',
            secondServerPort: '30120'
          }
        ]
      },
      {
        email: 'admin@gmail.com',
        username: 'admin',
        password: 'Admin1234!',
        displayName: 'Administrator',
        avatar: '',
        purchases: []
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(sampleUsers));
    console.log('Sample user data initialized');
  } else {
    console.log('Users already exist in localStorage, skipping sample data addition');
  }
};

// Get current logged-in user email
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('currentUser');
};

// Get all users (for admin panel)
export const getUsers = (): User[] => {
  const usersData = localStorage.getItem('users');
  if (usersData) {
    return JSON.parse(usersData);
  }
  return [];
};

// Get user profile by email
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

// Update user profile
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

// Get user purchases
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

// Add a new purchase
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

// Update purchase
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

// Update whitelist for purchase
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

// User Authentication Functions

// Save a new user
export const saveUser = (userData: { username: string; email: string; password: string }): boolean => {
  const usersData = localStorage.getItem('users');
  let users: User[] = [];
  
  if (usersData) {
    users = JSON.parse(usersData);
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return false;
    }
  }
  
  users.push({
    email: userData.email,
    username: userData.username,
    password: userData.password,
    purchases: []
  });
  
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};

// Validate login credentials
export const validateLogin = (email: string, password: string): boolean => {
  const usersData = localStorage.getItem('users');
  if (!usersData) return false;
  
  const users: User[] = JSON.parse(usersData);
  return users.some(user => user.email === email && user.password === password);
};

// Save user session (login)
export const saveUserSession = (email: string): void => {
  localStorage.setItem('currentUser', email);
};

// Clear user session (logout)
export const clearUserSession = (): void => {
  localStorage.removeItem('currentUser');
};

// Password Reset Functions

// Generate OTP code for password reset
export const generateOTPCode = (email: string): string | null => {
  const usersData = localStorage.getItem('users');
  if (!usersData) return null;
  
  const users: User[] = JSON.parse(usersData);
  const userIndex = users.findIndex(user => user.email === email);
  
  if (userIndex === -1) return null;
  
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set expiry to 10 minutes from now
  const expiry = Date.now() + 10 * 60 * 1000;
  
  users[userIndex].otpCode = otp;
  users[userIndex].otpExpiry = expiry;
  
  localStorage.setItem('users', JSON.stringify(users));
  
  return otp;
};

// Validate OTP code
export const validateOTPCode = (email: string, otp: string): boolean => {
  const usersData = localStorage.getItem('users');
  if (!usersData) return false;
  
  const users: User[] = JSON.parse(usersData);
  const user = users.find(u => u.email === email);
  
  if (!user || !user.otpCode || !user.otpExpiry) return false;
  
  // Check if OTP is valid and not expired
  return user.otpCode === otp && user.otpExpiry > Date.now();
};

// Create reset token after OTP validation
export const createResetTokenAfterOTP = (email: string): string => {
  const usersData = localStorage.getItem('users');
  if (!usersData) return '';
  
  const users: User[] = JSON.parse(usersData);
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) return '';
  
  // Generate token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Set expiry to 1 hour from now
  const expiry = Date.now() + 60 * 60 * 1000;
  
  users[userIndex].resetToken = token;
  users[userIndex].resetTokenExpiry = expiry;
  // Clear OTP since it's been used
  users[userIndex].otpCode = undefined;
  users[userIndex].otpExpiry = undefined;
  
  localStorage.setItem('users', JSON.stringify(users));
  
  return token;
};

// Validate reset token
export const validateResetToken = (email: string, token: string): boolean => {
  const usersData = localStorage.getItem('users');
  if (!usersData) return false;
  
  const users: User[] = JSON.parse(usersData);
  const user = users.find(u => u.email === email);
  
  if (!user || !user.resetToken || !user.resetTokenExpiry) return false;
  
  // Check if token is valid and not expired
  return user.resetToken === token && user.resetTokenExpiry > Date.now();
};

// Reset password
export const resetPassword = (email: string, token: string, newPassword: string): boolean => {
  // First validate the token
  if (!validateResetToken(email, token)) return false;
  
  const usersData = localStorage.getItem('users');
  if (!usersData) return false;
  
  const users: User[] = JSON.parse(usersData);
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) return false;
  
  // Update password
  users[userIndex].password = newPassword;
  // Clear reset token since it's been used
  users[userIndex].resetToken = undefined;
  users[userIndex].resetTokenExpiry = undefined;
  
  localStorage.setItem('users', JSON.stringify(users));
  
  return true;
};
