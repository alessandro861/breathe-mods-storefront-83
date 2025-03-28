
// Service pour gérer les achats
export interface Purchase {
  id: string;
  userId: string;
  modId: string;
  modName: string;
  productName?: string; // Added to match userService
  date: string;
  price: number;
  status: 'completed' | 'pending' | 'failed';
  licenseKey?: string;
  serverName?: string; // Added to support whitelist functionality
  serverIp?: string; // Added to support whitelist functionality
  serverPort?: string; // Added to support whitelist functionality
  secondServerName?: string; // Added to support secondary whitelist
  secondServerIp?: string; // Added to support secondary whitelist
  secondServerPort?: string; // Added to support secondary whitelist
}

// Fonction pour récupérer tous les achats
export const getAllPurchases = (): Purchase[] => {
  const purchases = localStorage.getItem('purchases');
  if (!purchases) {
    // Initialiser avec un tableau vide au lieu des exemples
    localStorage.setItem('purchases', JSON.stringify([]));
    return [];
  }
  return JSON.parse(purchases);
};

// Fonction pour ajouter un achat
export const addPurchase = (purchase: Purchase): void => {
  const purchases = getAllPurchases();
  purchases.push(purchase);
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

// Fonction pour mettre à jour un achat
export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getAllPurchases();
  const index = purchases.findIndex(p => p.id === updatedPurchase.id);
  if (index !== -1) {
    purchases[index] = updatedPurchase;
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }
};

// Fonction pour supprimer un achat
export const deletePurchase = (id: string): void => {
  const purchases = getAllPurchases();
  const updatedPurchases = purchases.filter(p => p.id !== id);
  localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
};
