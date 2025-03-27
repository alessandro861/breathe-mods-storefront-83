
export interface Review {
  id: string;
  userId: string;
  username: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

// Get all reviews
export const getAllReviews = (): Review[] => {
  const reviewsData = localStorage.getItem('reviews');
  if (reviewsData) {
    return JSON.parse(reviewsData);
  }
  return [];
};

// Get approved reviews only
export const getApprovedReviews = (): Review[] => {
  const reviews = getAllReviews();
  return reviews.filter(review => review.isApproved);
};

// Get reviews by user email
export const getUserReviews = (email: string): Review[] => {
  const reviews = getAllReviews();
  return reviews.filter(review => review.userId === email);
};

// Add a new review
export const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'isApproved'>): Review => {
  const reviews = getAllReviews();
  
  const newReview: Review = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    date: new Date().toISOString(),
    isApproved: false // Reviews need approval before being published
  };
  
  reviews.push(newReview);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  
  return newReview;
};

// Approve a review (for admin use)
export const approveReview = (reviewId: string): boolean => {
  const reviews = getAllReviews();
  const reviewIndex = reviews.findIndex(rev => rev.id === reviewId);
  
  if (reviewIndex !== -1) {
    reviews[reviewIndex].isApproved = true;
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return true;
  }
  
  return false;
};

// Delete a review
export const deleteReview = (reviewId: string): boolean => {
  const reviews = getAllReviews();
  const filteredReviews = reviews.filter(rev => rev.id !== reviewId);
  
  if (filteredReviews.length !== reviews.length) {
    localStorage.setItem('reviews', JSON.stringify(filteredReviews));
    return true;
  }
  
  return false;
};

// Initialize sample reviews
export const initializeSampleReviews = (): void => {
  const existingReviews = localStorage.getItem('reviews');
  
  if (!existingReviews) {
    const sampleReviews: Review[] = [
      {
        id: 'rev_1',
        userId: 'user@example.com',
        username: 'Demo User',
        productId: 'p1234567890',
        productName: 'Capture Flag',
        rating: 5,
        comment: "This mod works perfectly, highly recommended!",
        date: '2023-11-20',
        isApproved: true
      },
      {
        id: 'rev_2',
        userId: 'admin@gmail.com',
        username: 'Administrator',
        productId: 'p2345678901',
        productName: 'Advanced Whitelist',
        rating: 4,
        comment: "Great mod, just needed some minor adjustments for my server.",
        date: '2023-12-15',
        isApproved: true
      }
    ];
    
    localStorage.setItem('reviews', JSON.stringify(sampleReviews));
    console.log('Sample reviews initialized');
  }
};
