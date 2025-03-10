
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Construction } from 'lucide-react';

const WorkInProgress = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-shine flex items-center justify-center gap-3">
            <Construction className="h-8 w-8 text-primary animate-pulse" />
            Work in Progress
            <Construction className="h-8 w-8 text-primary animate-pulse" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our team is currently working on exciting new features and mods for you. 
            Check back soon to see what we've been creating!
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <ul className="space-y-4 text-gray-200">
                <li className="flex items-center gap-3">
                  <span className="text-primary">•</span>
                  <span>Advanced mod configuration options</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">•</span>
                  <span>More game compatibility</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">•</span>
                  <span>User profiles and mod tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">•</span>
                  <span>Mod installation guides</span>
                </li>
              </ul>
            </div>
            
            <div className="w-full max-w-xl mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-center text-sm text-gray-300">
                <span className="text-primary font-medium">Want to suggest a feature?</span> 
                <br />Join our Discord server and let us know what you'd like to see next!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default WorkInProgress;
