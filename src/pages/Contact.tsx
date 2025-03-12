
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const Contact = () => {
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
            <p className="text-muted-foreground">Get in touch with the Breathe Mods team</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;
