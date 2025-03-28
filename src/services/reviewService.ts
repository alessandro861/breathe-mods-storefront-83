
// Interface pour les avis
export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  modId?: string;
  productId?: string;
  productName?: string;
}

// Fonction pour initialiser les avis d'exemple
export const initializeSampleReviews = () => {
  if (!localStorage.getItem('reviews')) {
    console.info('Sample reviews initialized');
    // Initialiser avec un tableau vide au lieu des exemples
    localStorage.setItem('reviews', JSON.stringify([]));
  }
};

// Fonction pour récupérer tous les avis
export const getAllReviews = (): Review[] => {
  initializeSampleReviews();
  const reviews = localStorage.getItem('reviews');
  if (!reviews) {
    return [];
  }
  return JSON.parse(reviews);
};

// Fonction pour récupérer les avis approuvés
export const getApprovedReviews = (): Review[] => {
  // Dans un système réel, on filtrerait en fonction d'un statut 'approved'
  // Pour simplifier, on retourne tous les avis
  return getAllReviews();
};

// Fonction pour ajouter un avis
export const addReview = (review: Partial<Review>): void => {
  const reviews = getAllReviews();
  const newReview: Review = {
    id: `rev_${Date.now()}`,
    userId: review.userId || '',
    username: review.username || '',
    rating: review.rating || 5,
    comment: review.comment || '',
    date: new Date().toISOString().split('T')[0],
    ...(review.modId && { modId: review.modId }),
    ...(review.productId && { productId: review.productId }),
    ...(review.productName && { productName: review.productName })
  };
  
  reviews.push(newReview);
  localStorage.setItem('reviews', JSON.stringify(reviews));
};

// Fonction pour mettre à jour un avis
export const updateReview = (updatedReview: Review): void => {
  const reviews = getAllReviews();
  const index = reviews.findIndex(r => r.id === updatedReview.id);
  if (index !== -1) {
    reviews[index] = updatedReview;
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }
};

// Fonction pour supprimer un avis
export const deleteReview = (id: string): void => {
  const reviews = getAllReviews();
  const updatedReviews = reviews.filter(r => r.id !== id);
  localStorage.setItem('reviews', JSON.stringify(updatedReviews));
};
