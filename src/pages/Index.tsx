import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import NavButton from '../components/NavButton';
import { Button } from '@/components/ui/button';
import { Download, Shield, Gift, Ticket, ArrowRight, Star, MousePointer, ShoppingBag, Menu, UserRound, LayoutGrid, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '@/services/userService';
import HeroSection from '../components/HeroSection';
import ReviewsSection from '../components/ReviewsSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { initializeSampleReviews } from '@/services/reviewService';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index: React.FC = () => {
  const currentUser = getCurrentUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Initialize sample reviews on app load
    initializeSampleReviews();
  }, []);
  
  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 bg-secondary/80 backdrop-blur-sm">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="pt-10 flex flex-col space-y-4">
          <h3 className="text-xl font-bold mb-4">Menu</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link to="/" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span>Accueil</span>
              </Button>
            </Link>
            
            <Link to="/free-mods" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                <span>Mods</span>
              </Button>
            </Link>
            
            <Link to="/rules" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Règles</span>
              </Button>
            </Link>
            
            <Link to="/tickets" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                <span>Support</span>
              </Button>
            </Link>
            
            <Link to="/wip" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-primary" />
                <span>WIP</span>
              </Button>
            </Link>
            
            {currentUser && (
              <Link to="/profile" className="w-full">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" />
                  <span>Profil</span>
                </Button>
              </Link>
            )}
          </div>

          <a 
            href="https://discord.gg/Yr8aY3fW4f" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button size="sm" variant="default" className="w-full">
              <Ticket className="mr-2 h-4 w-4" />
              Rejoindre Discord
            </Button>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  return (
    <Layout>
      {isMobile && <MobileMenu />}
      
      <div className="container mx-auto flex flex-col items-center justify-center space-y-8 md:space-y-16 px-4 md:px-0">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Action Buttons - Desktop Only */}
        {!isMobile && (
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
        )}

        {/* Mobile Features Section - Updated with better styling */}
        {isMobile && (
          <section className="w-full pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <Card className="glass-panel overflow-hidden mb-4 border-primary/20">
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-center text-primary">Commencez l'aventure</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/free-mods" className="w-full">
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Download className="mr-2 h-4 w-4" />
                        <span>Mods</span>
                      </Button>
                    </Link>
                    <a href="https://discord.gg/Yr8aY3fW4f" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Ticket className="mr-2 h-4 w-4" />
                        <span>Discord</span>
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </section>
        )}

        {/* Features Section - Desktop */}
        {!isMobile && (
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
        )}
        
        {/* Mobile Grid Features - Updated with better grid layout */}
        {isMobile && (
          <section className="w-full pb-6">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-lg font-bold mb-3 text-center"
            >
              Pourquoi nous choisir ?
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { icon: <Star className="h-5 w-5 text-primary" />, title: "Premium", desc: "Des mods de haute qualité" },
                { icon: <Shield className="h-5 w-5 text-primary" />, title: "À jour", desc: "Compatibilité assurée" },
                { icon: <Gift className="h-5 w-5 text-primary" />, title: "Sur mesure", desc: "Mods personnalisés" },
                { icon: <LayoutGrid className="h-5 w-5 text-primary" />, title: "Polyvalent", desc: "De nombreuses options" },
              ].map((feature, index) => (
                <Card key={index} className="glass-panel overflow-hidden border-none">
                  <CardContent className="p-3">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-secondary/50 p-2 rounded-full mb-2">
                        {feature.icon}
                      </div>
                      <h4 className="text-sm font-medium text-primary mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-400">{feature.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </section>
        )}
        
        {/* Reviews Section */}
        <ReviewsSection />

        {/* Quick Access - Desktop */}
        {!isMobile && (
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
        )}
      </div>
    </Layout>
  );
};

export default Index;
