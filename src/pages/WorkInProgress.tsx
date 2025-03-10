
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Construction, Sofa } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

const WorkInProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(65), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-shine flex items-center justify-center gap-3">
            <Construction className="h-8 w-8 text-primary animate-pulse" />
            Work in Progress
            <Construction className="h-8 w-8 text-primary animate-pulse" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4">
            Our team is currently working on exciting new features and mods for you. 
            Check back soon to see what we've been creating!
          </p>
          <div className="max-w-md mx-auto mt-6 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Development Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Furniture Category Section */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-3 mb-4">
              <Sofa className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Furniture Mods</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="glass-panel rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/58e5571e-0b7e-45cd-8e07-a13b1afe81cc.png" 
                  alt="Furniture set with cabinets and workbench" 
                  className="w-full h-auto object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Complete Workshop Set</h3>
                  <p className="text-sm text-gray-300">Modular cabinet system with integrated workbench and tool storage</p>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Development</span>
                      <span className="text-xs">75%</span>
                    </div>
                    <Progress value={75} className="h-1" />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/f2cf25d9-9ea7-4b3b-b838-92624f9fc398.png" 
                  alt="Storage cabinets and shelving" 
                  className="w-full h-auto object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Storage Systems</h3>
                  <p className="text-sm text-gray-300">Industrial grade cabinets and shelving units with customizable interiors</p>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Development</span>
                      <span className="text-xs">60%</span>
                    </div>
                    <Progress value={60} className="h-1" />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/1bfd498f-bfaf-4cbf-a667-00adb116c079.png" 
                  alt="Wall panel system" 
                  className="w-full h-auto object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Wall Panel Systems</h3>
                  <p className="text-sm text-gray-300">Modular wall panels with mounting options for tools and accessories</p>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Development</span>
                      <span className="text-xs">80%</span>
                    </div>
                    <Progress value={80} className="h-1" />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/4b17693f-3657-4527-9bcc-b92c125faef5.png" 
                  alt="Furniture components" 
                  className="w-full h-auto object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Component System</h3>
                  <p className="text-sm text-gray-300">Individual furniture components for custom arrangements and setups</p>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Development</span>
                      <span className="text-xs">45%</span>
                    </div>
                    <Progress value={45} className="h-1" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-xl mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-center text-sm text-gray-300">
                <span className="text-primary font-medium">Furniture mod release estimated for Q3 2023</span> 
                <br />High-quality industrial furniture sets with customizable features.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default WorkInProgress;
