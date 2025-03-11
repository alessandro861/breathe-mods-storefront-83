
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-4 text-shine">404</h1>
          <p className="text-xl text-gray-300 mb-8">Oops! The page you're looking for doesn't exist.</p>
          <Link to="/">
            <Button size="lg" className="group">
              <Home className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
