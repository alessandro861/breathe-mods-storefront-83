
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

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

          <Card className="border border-white/10 bg-black/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <h3 className="font-semibold">E-Mail</h3>
                  <p className="text-muted-foreground">coming soon</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <h3 className="font-semibold">Discord PM</h3>
                  <p className="text-muted-foreground">kokos_dv</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <h3 className="font-semibold">Discord Server</h3>
                  <a 
                    href="https://discord.gg/c4arcAJrU5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Join our Discord <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <a 
                  href="https://discord.gg/c4arcAJrU5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-md text-primary transition-colors text-sm"
                >
                  Join Server
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;
