// userService.ts
interface User {
  email: string;
  password?: string;
}

const USERS_KEY = 'users';

// Initialize users in localStorage if they don't exist
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([]));
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

// Password reset functionality
const RESET_TOKENS_KEY = 'reset_tokens';

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
