import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import NavButton from '../components/NavButton';
import { Button } from '@/components/ui/button';
import { Download, Shield, Gift, Ticket, ArrowRight, Star, MousePointer, ShoppingBag, Menu, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '@/services/userService';
import HeroSection from '../components/HeroSection';
import ReviewsSection from '../components/ReviewsSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { initializeSampleReviews } from '@/services/reviewService';

const Index: React.FC = () => {
  const currentUser = getCurrentUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Initialize sample reviews on app load
    initializeSampleReviews();
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto flex flex-col items-center justify-center space-y-8 md:space-y-16 px-4 md:px-0">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Action Buttons */}
        <section className="w-full">
          <motion.div 
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col w-full md:flex-row md:flex-wrap md:gap-4 md:justify-center gap-3"
            >
              <Link to="/free-mods" className="w-full md:w-auto">
                <Button size="lg" className="text-md group w-full md:w-auto">
                  <Download className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Get Mods
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                </Button>
              </Link>
              <a 
                href="https://discord.gg/Yr8aY3fW4f" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto"
              >
                <Button size="lg" variant="outline" className="text-md w-full md:w-auto">
                  <Ticket className="mr-2 h-5 w-5" />
                  Join Discord
                </Button>
              </a>
              {currentUser && (
                <Link to="/purchases" className="w-full md:w-auto">
                  <Button size="lg" variant="secondary" className="text-md w-full md:w-auto">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    My Purchases
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full mt-4 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto"
          >
            {[
              { 
                icon: <Star className="h-8 w-8 text-primary mb-3" />,
                title: "Premium Quality", 
                desc: "Meticulously crafted modifications that enhance your gameplay without compromising stability" 
              },
              { 
                icon: <Shield className="h-8 w-8 text-primary mb-3" />,
                title: "Regularly Updated", 
                desc: "All mods are maintained and updated to ensure compatibility with the latest game versions" 
              },
              { 
                icon: <Gift className="h-8 w-8 text-primary mb-3" />,
                title: "Custom Options", 
                desc: "Request personalized modifications tailored to your specific needs through our Discord" 
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="glass-panel rounded-xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + (index * 0.2), duration: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  {feature.icon}
                  <h3 className="text-lg font-medium mb-2 text-primary">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Reviews Section */}
        <ReviewsSection />

        {/* Quick Access */}
        <section className="w-full pb-6 md:pb-0">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <NavButton to="/rules" label="Rules" icon={<Shield className="h-5 w-5 text-primary" />} delay={0.1} />
            <NavButton to="/free-mods" label="Mods" icon={<Download className="h-5 w-5 text-primary" />} delay={0.2} />
            <NavButton to="/tickets" label="Ticket System" icon={<Ticket className="h-5 w-5 text-primary" />} delay={0.4} />
            {currentUser && (
              <>
                <NavButton to="/purchases" label="My Purchases" icon={<ShoppingBag className="h-5 w-5 text-primary" />} delay={0.6} comingSoon={false} />
                <NavButton to="/profile" label="My Profile" icon={<UserRound className="h-5 w-5 text-primary" />} delay={0.8} comingSoon={false} />
              </>
            )}
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
