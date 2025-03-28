// Types pour les utilisateurs
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  discordId?: string;
}

export interface UserProfile {
  username: string;
  displayName?: string;
  email: string;
  createdAt: string;
  bio?: string;
  avatarUrl?: string;
  avatar?: string; // Added this property to fix UserProfile errors
}

export interface Purchase {
  id: string;
  userId: string;
  modId: string;
  modName: string;
  productName?: string; // Added this property
  date: string;
  price: number;
  status: 'completed' | 'pending' | 'failed';
  licenseKey?: string;
  serverIp?: string;
  serverName?: string;
  serverPort?: string;
  whitelist?: boolean;
  secondServerName?: string; // Added this property
  secondServerIp?: string; // Added this property
  secondServerPort?: string; // Added this property
}

// Fonction pour initialiser les données utilisateur
export const initializeSampleUserData = () => {
  if (!localStorage.getItem('users')) {
    console.info('Initializing empty user data');
    localStorage.setItem('users', JSON.stringify([]));
  } else {
    console.info('Users already exist in localStorage, skipping sample data addition');
  }
};

// Fonction pour récupérer tous les utilisateurs
export const getAllUsers = (): User[] => {
  const users = localStorage.getItem('users');
  if (!users) {
    initializeSampleUserData();
    return [];
  }
  return JSON.parse(users);
};

// Fonction pour ajouter un utilisateur
export const addUser = (user: User): void => {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

// Fonction pour mettre à jour un utilisateur
export const updateUser = (updatedUser: User): void => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUser = (id: string): void => {
  const users = getAllUsers();
  const updatedUsers = users.filter(u => u.id !== id);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
};

// Fonction pour trouver un utilisateur par email
export const findUserByEmail = (email: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.email === email);
};

// Fonction pour trouver un utilisateur par ID
export const findUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.id === id);
};

// Fonctions additionnelles demandées par l'application

// Valider les identifiants de connexion
export const validateLogin = (email: string, password: string): boolean => {
  const user = findUserByEmail(email);
  return !!user && user.password === password;
};

// Sauvegarder la session utilisateur
export const saveUserSession = (email: string): void => {
  localStorage.setItem('currentUser', email);
};

// Obtenir l'utilisateur courant
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('currentUser');
};

// Effacer la session utilisateur
export const clearUserSession = (): void => {
  localStorage.removeItem('currentUser');
};

// Ajouter un nouvel utilisateur
export const saveUser = (userData: Partial<User>): boolean => {
  const newUser: User = {
    id: `user_${Date.now()}`,
    username: userData.username || '',
    email: userData.email || '',
    password: userData.password || '',
    createdAt: new Date().toISOString(),
    isVerified: false,
    role: 'user',
    ...userData
  };
  
  addUser(newUser);
  return true;
};

// Générer un code OTP pour la récupération de mot de passe
export const generateOTPCode = (email: string): string | null => {
  const user = findUserByEmail(email);
  if (!user) return null;
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem(`otp_${email}`, otp);
  return otp;
};

// Valider un code OTP
export const validateOTPCode = (email: string, code: string): boolean => {
  const storedOtp = localStorage.getItem(`otp_${email}`);
  return storedOtp === code;
};

// Créer un token après validation OTP
export const createResetTokenAfterOTP = (email: string): string => {
  const token = `rst_${Date.now()}`;
  localStorage.setItem(`reset_token_${email}`, token);
  return token;
};

// Valider un token de réinitialisation
export const validateResetToken = (email: string, token: string): boolean => {
  const storedToken = localStorage.getItem(`reset_token_${email}`);
  return storedToken === token;
};

// Réinitialiser le mot de passe
export const resetPassword = (email: string, newPassword: string): boolean => {
  const user = findUserByEmail(email);
  if (!user) return false;
  
  user.password = newPassword;
  updateUser(user);
  
  // Nettoyer les tokens
  localStorage.removeItem(`otp_${email}`);
  localStorage.removeItem(`reset_token_${email}`);
  
  return true;
};

// Récupérer le profil utilisateur
export const getUserProfile = (email: string): UserProfile | null => {
  const user = findUserByEmail(email);
  if (!user) return null;
  
  return {
    username: user.username,
    displayName: user.username, // Par défaut, displayName est le username
    email: user.email,
    createdAt: user.createdAt,
  };
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = (email: string, profile: Partial<UserProfile>): boolean => {
  const user = findUserByEmail(email);
  if (!user) return false;
  
  // Mise à jour des champs autorisés
  if (profile.displayName) user.username = profile.displayName;
  
  updateUser(user);
  return true;
};

// Fonctions pour gérer les achats d'un utilisateur
export const getUserPurchases = (email: string): Purchase[] => {
  const purchases = localStorage.getItem(`purchases_${email}`);
  if (!purchases) return [];
  return JSON.parse(purchases);
};

// Ajouter un achat pour un utilisateur
export const addPurchase = (email: string, purchase: any): boolean => {
  const purchases = getUserPurchases(email);
  purchases.push(purchase);
  localStorage.setItem(`purchases_${email}`, JSON.stringify(purchases));
  return true;
};

// Function signature update for updateWhitelistForPurchase
export const updateWhitelistForPurchase = (
  email: string, 
  purchaseId: string, 
  serverDetails: {
    serverName?: string;
    serverIp?: string;
    serverPort?: string;
  },
  isSecondary: boolean = false
): Purchase => {
  const purchases = getUserPurchases(email);
  const index = purchases.findIndex(p => p.id === purchaseId);
  
  if (index === -1) throw new Error("Purchase not found");
  
  // Update the correct set of properties based on whether this is a primary or secondary whitelist
  if (isSecondary) {
    purchases[index] = {
      ...purchases[index],
      secondServerName: serverDetails.serverName,
      secondServerIp: serverDetails.serverIp,
      secondServerPort: serverDetails.serverPort
    };
  } else {
    purchases[index] = {
      ...purchases[index],
      serverName: serverDetails.serverName,
      serverIp: serverDetails.serverIp,
      serverPort: serverDetails.serverPort
    };
  }
  
  localStorage.setItem(`purchases_${email}`, JSON.stringify(purchases));
  return purchases[index];
};

// Pour l'admin: récupérer tous les utilisateurs avec leurs données
export const getUsers = (): UserProfile[] => {
  const users = getAllUsers();
  return users.map(user => ({
    username: user.username,
    displayName: user.username,
    email: user.email,
    createdAt: user.createdAt,
  }));
};

// Initialiser des exemples de données pour la démo
export const addSampleData = (): void => {
  // Ne rien faire car on veut des listes vides
  initializeSampleUserData();
};
