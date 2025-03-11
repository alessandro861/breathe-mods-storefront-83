
interface User {
  username?: string;
  email: string;
  password: string;
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
