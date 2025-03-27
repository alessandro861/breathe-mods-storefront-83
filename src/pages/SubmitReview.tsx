
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addReview } from '@/services/reviewService';
import { getUserProfile, getCurrentUser } from '@/services/userService';

const SubmitReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Product details from URL query params
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId') || '';
  const productName = queryParams.get('productName') || '';
  
  useEffect(() => {
    // If no product details, redirect to home
    if (!productId || !productName) {
      toast({
        title: "Missing information",
        description: "Product details not found. Please try again.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [productId, productName, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const userEmail = getCurrentUser();
    if (!userEmail) {
      toast({
        title: "Please login",
        description: "You need to be logged in to submit a review.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (comment.trim().length < 5) {
      toast({
        title: "Review too short",
        description: "Please write a more detailed review.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user profile to get username
      const userProfile = getUserProfile(userEmail);
      
      if (!userProfile) {
        throw new Error("User profile not found");
      }
      
      // Create review
      addReview({
        userId: userEmail,
        username: userProfile.displayName || userProfile.username,
        productId,
        productName,
        rating,
        comment
      });
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback! Your review will be published after moderation.",
      });
      
      // Redirect to home page after successful submission
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 rounded-xl"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            Review: {productName}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Review Comment */}
            <div className="space-y-2">
              <label htmlFor="comment" className="block text-sm font-medium">
                Your Review
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="min-h-[120px]"
                required
              />
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || comment.trim().length < 5}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Review
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SubmitReview;
