
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
