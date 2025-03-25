
// userService.ts
interface User {
  email: string;
  password?: string;
  username?: string;
}

// Purchase interface needed by other components
export interface Purchase {
  id: string;
  productName: string;
  date: string;
  price: number;
  serverName?: string;
  serverIp?: string;
  serverPort?: string;
}

const USERS_KEY = 'users';
const PURCHASES_KEY = 'user_purchases';
const RESET_TOKENS_KEY = 'reset_tokens';

// Initialize users in localStorage if they don't exist
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

// Initialize purchases in localStorage if they don't exist
if (!localStorage.getItem(PURCHASES_KEY)) {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify({}));
}

// Function to add sample data (for testing purposes)
export const addSampleData = () => {
  let users = getUsers();
  if (users.length === 0) {
    const sampleUsers = [
      { email: 'admin@gmail.com', password: 'Admin1234!' },
      { email: 'user1@example.com', password: 'User1234!' },
      { email: 'user2@example.com', password: 'User5678!' },
    ];
    saveUsers(sampleUsers);
    console.log('Sample users added to localStorage');
  } else {
    console.log('Users already exist in localStorage, skipping sample data addition');
  }
};

// Function to get users from localStorage
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Function to save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Function to save a new user (for signup)
export const saveUser = (userData: User): boolean => {
  const users = getUsers();
  
  // Check if user with this email already exists
  const userExists = users.some(user => user.email === userData.email);
  
  if (userExists) {
    return false; // User already exists
  }
  
  // Add the new user
  users.push(userData);
  saveUsers(users);
  return true;
};

// Function to validate login credentials
export const validateLogin = (email: string, password?: string): boolean => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  return !!user && user.password === password;
};

// Function to save user session (in a real app, use a more secure method)
export const saveUserSession = (email: string) => {
  localStorage.setItem('currentUser', email);
};

// Function to get current user from session
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('currentUser');
};

// Function to clear user session
export const clearUserSession = () => {
  localStorage.removeItem('currentUser');
};

// PURCHASES FUNCTIONALITY

// Function to get all purchases for a user
export const getUserPurchases = (userEmail: string): Purchase[] => {
  const purchasesJson = localStorage.getItem(PURCHASES_KEY);
  const allPurchases = purchasesJson ? JSON.parse(purchasesJson) : {};
  
  // Return the user's purchases or an empty array if none exist
  return allPurchases[userEmail] || [];
};

// Function to add a purchase for a user
export const addPurchase = (userEmail: string, purchase: Purchase): boolean => {
  try {
    const purchasesJson = localStorage.getItem(PURCHASES_KEY);
    const allPurchases = purchasesJson ? JSON.parse(purchasesJson) : {};
    
    // Initialize user's purchases array if it doesn't exist
    if (!allPurchases[userEmail]) {
      allPurchases[userEmail] = [];
    }
    
    // Add the new purchase
    allPurchases[userEmail].push(purchase);
    
    // Save back to localStorage
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(allPurchases));
    return true;
  } catch (error) {
    console.error('Error adding purchase:', error);
    return false;
  }
};

// Function to update a purchase
export const updatePurchase = (userEmail: string, purchaseId: string, updateData: Partial<Purchase>): boolean => {
  try {
    const purchasesJson = localStorage.getItem(PURCHASES_KEY);
    const allPurchases = purchasesJson ? JSON.parse(purchasesJson) : {};
    
    // Check if user has purchases
    if (!allPurchases[userEmail]) {
      return false;
    }
    
    // Find the purchase to update
    const userPurchases = allPurchases[userEmail];
    const purchaseIndex = userPurchases.findIndex((p: Purchase) => p.id === purchaseId);
    
    if (purchaseIndex === -1) {
      return false; // Purchase not found
    }
    
    // Update the purchase
    allPurchases[userEmail][purchaseIndex] = {
      ...allPurchases[userEmail][purchaseIndex],
      ...updateData
    };
    
    // Save back to localStorage
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(allPurchases));
    return true;
  } catch (error) {
    console.error('Error updating purchase:', error);
    return false;
  }
};

// Password reset functionality

interface ResetToken {
  email: string;
  token: string;
  expiry: number; // timestamp
}

// Get all reset tokens
export const getResetTokens = (): ResetToken[] => {
  const tokensJson = localStorage.getItem(RESET_TOKENS_KEY);
  return tokensJson ? JSON.parse(tokensJson) : [];
};

// Save reset tokens
const saveResetTokens = (tokens: ResetToken[]) => {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
};

// Generate a reset token for an email
export const generateResetToken = (email: string): string | null => {
  // Verify that the user exists
  const users = getUsers();
  const userExists = users.some(user => user.email === email);
  
  if (!userExists) {
    // For security reasons, we should not inform the user that the email doesn't exist
    // But we won't generate a token either
    return null;
  }
  
  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Set expiry to 24 hours from now
  const expiry = Date.now() + (24 * 60 * 60 * 1000);
  
  // Save the token
  const tokens = getResetTokens();
  
  // Remove any existing tokens for this email
  const filteredTokens = tokens.filter(t => t.email !== email);
  
  // Add the new token
  filteredTokens.push({ email, token, expiry });
  
  // Save tokens back to localStorage
  saveResetTokens(filteredTokens);
  
  return token;
};

// Validate reset token
export const validateResetToken = (email: string, token: string): boolean => {
  const tokens = getResetTokens();
  const resetToken = tokens.find(t => t.email === email && t.token === token);
  
  if (!resetToken) {
    return false;
  }
  
  // Check if token has expired
  if (resetToken.expiry < Date.now()) {
    // Remove expired token
    const filteredTokens = tokens.filter(t => !(t.email === email && t.token === token));
    saveResetTokens(filteredTokens);
    return false;
  }
  
  return true;
};

// Reset password with token
export const resetPassword = (email: string, token: string, newPassword: string): boolean => {
  // Validate the token first
  if (!validateResetToken(email, token)) {
    return false;
  }
  
  // Update user's password
  const users = getUsers();
  const updatedUsers = users.map(user => {
    if (user.email === email) {
      return { ...user, password: newPassword };
    }
    return user;
  });
  
  saveUsers(updatedUsers);
  
  // Remove the used token
  const tokens = getResetTokens();
  const filteredTokens = tokens.filter(t => !(t.email === email && t.token === token));
  saveResetTokens(filteredTokens);
  
  return true;
};
