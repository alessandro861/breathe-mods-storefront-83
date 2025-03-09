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
        {/* Hero Section */}
        <section className="w-full">
          <motion.div 
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight"
            >
              ELEVATE YOUR DAYZ EXPERIENCE
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-8"
            >
              Enhance your gaming with premium DayZ modifications carefully crafted for the best experience
            </motion.p>
            
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
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-shine">Quick Access</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Find everything you need with just one click
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <NavButton to="/rules" label="Rules" icon={<Shield className="h-5 w-5 text-primary" />} delay={0.1} />
            <NavButton to="/free-mods" label="Mods" icon={<Download className="h-5 w-5 text-primary" />} delay={0.2} />
            <NavButton to="/request" label="Request a Mod" icon={<Ticket className="h-5 w-5 text-primary" />} delay={0.4} />
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-shine">How It Works</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Getting started with Breathe Mods is simple
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.5 }}
          >
            {[
              {
                step: "01",
                title: "Browse Mods",
                desc: "Explore our collection of free and premium DayZ mods"
              },
              {
                step: "02",
                title: "Select & Download",
                desc: "Choose the mods that match your playstyle and download them"
              },
              {
                step: "03",
                title: "Installation",
                desc: "Follow our simple instructions to install and enjoy your new mods"
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-primary/50 mb-3">{item.step}</div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.5 }}
          >
            <Link to="/free-mods">
              <Button className="group">
                <MousePointer className="mr-2 h-4 w-4" />
                Start Browsing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </section>
        
        {/* Discord CTA */}
        <section className="w-full max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <div className="text-left md:max-w-md">
              <h2 className="text-2xl font-bold mb-2">Join Our Community</h2>
              <p className="text-gray-300">
                Connect with other mod enthusiasts, get support, and stay updated on the latest releases by joining our Discord server.
              </p>
            </div>
            <div>
              <a href="https://discord.gg/Yr8aY3fW4f" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="default" className="whitespace-nowrap">
                  Join Discord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
