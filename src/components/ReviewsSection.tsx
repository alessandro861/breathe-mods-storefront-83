
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getApprovedReviews, Review } from '@/services/reviewService';
import { useIsMobile } from '@/hooks/use-mobile';

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const approvedReviews = getApprovedReviews();
    setReviews(approvedReviews);
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    
    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % reviews.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };

  if (reviews.length === 0) {
    return null; // Don't show the section if no reviews
  }

  return (
    <section className="w-full py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary">
          User Reviews
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          See what others are saying about our mods
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 md:p-8 rounded-xl relative"
        >
          <Quote className="text-primary/20 h-12 w-12 absolute top-4 right-4" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-4 mb-4">
            <div className="mb-2 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold">{reviews[currentIndex].username.charAt(0)}</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg">{reviews[currentIndex].username}</h3>
              <p className="text-sm text-gray-400">
                {new Date(reviews[currentIndex].date).toLocaleDateString()} - {reviews[currentIndex].productName}
              </p>
              <div className="flex mt-1">
                {renderStars(reviews[currentIndex].rating)}
              </div>
            </div>
          </div>
          
          <blockquote className="text-gray-200 text-lg font-light italic mt-4">
            "{reviews[currentIndex].comment}"
          </blockquote>
          
          {reviews.length > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === index ? 'bg-primary scale-110' : 'bg-white/30'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
