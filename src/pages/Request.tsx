
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

const Request = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-shine">Request a Mod</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Can't find the mod you're looking for? Request it through our Discord server and our team will try to help you.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold mb-4">How to Request a Mod</h2>
              <ol className="text-left space-y-4 text-gray-200">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">1.</span> 
                  <span>Join our Discord server by clicking the button below</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">2.</span> 
                  <span>Go to the #mod-requests channel</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">3.</span> 
                  <span>Create a ticket with details about the mod you're looking for</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">4.</span> 
                  <span>Our team will respond as soon as possible</span>
                </li>
              </ol>
            </div>
            
            <a 
              href="https://discord.gg/Yr8aY3fW4f" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" className="mt-6 group">
                <Ticket className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Make a Ticket
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Request;
