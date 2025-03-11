
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import NavButton from '../components/NavButton';
import { Button } from '@/components/ui/button';
import { Download, Shield, Gift, Ticket, ArrowRight, Star, MousePointer } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col items-center justify-center space-y-20">
        {/* Hero Section with just buttons */}
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
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/free-mods">
                <Button size="lg" className="text-md group">
                  <Download className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Get Mods
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                </Button>
              </Link>
              <a href="https://discord.gg/Yr8aY3fW4f" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-md">
                  <Ticket className="mr-2 h-5 w-5" />
                  Join Discord
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {[
              { 
                icon: <Star className="h-10 w-10 text-primary mb-4" />,
                title: "Premium Quality", 
                desc: "Meticulously crafted modifications that enhance your gameplay without compromising stability" 
              },
              { 
                icon: <Shield className="h-10 w-10 text-primary mb-4" />,
                title: "Regularly Updated", 
                desc: "All mods are maintained and updated to ensure compatibility with the latest game versions" 
              },
              { 
                icon: <Gift className="h-10 w-10 text-primary mb-4" />,
                title: "Custom Options", 
                desc: "Request personalized modifications tailored to your specific needs through our Discord" 
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="glass-panel rounded-xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + (index * 0.2), duration: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  {feature.icon}
                  <h3 className="text-xl font-medium mb-3 text-primary">{feature.title}</h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Quick Access */}
        <section className="w-full">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <NavButton to="/rules" label="Rules" icon={<Shield className="h-5 w-5 text-primary" />} delay={0.1} />
            <NavButton to="/free-mods" label="Mods" icon={<Download className="h-5 w-5 text-primary" />} delay={0.2} />
            <NavButton to="/tickets" label="Ticket System" icon={<Ticket className="h-5 w-5 text-primary" />} delay={0.4} />
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
