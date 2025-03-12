
import React from 'react';
import Layout from '@/components/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
        
        <p className="text-gray-300 mb-6">Last updated: [12/03/2025]</p>
        
        <p className="text-gray-300 mb-6">
          At Breathe, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and store your data.
        </p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">1. Information We Collect</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>When you make a purchase, we collect your email, payment details (handled securely by third-party processors), and transaction history.</li>
            <li>We may collect non-personal information such as your IP address for analytics and security purposes.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">2. How We Use Your Information</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>To process transactions and provide you with purchased mods.</li>
            <li>To improve our website and services based on user behavior and feedback.</li>
            <li>To send updates related to your purchases, if you opt-in.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">3. Data Protection & Security</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>We use encryption and security measures to protect your data from unauthorized access.</li>
            <li>We do not sell, rent, or share your personal information with third parties, except when required by law.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">4. Cookies</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>We use cookies to enhance user experience and track website usage. You can disable cookies in your browser settings.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">5. Your Rights</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>You have the right to request access to your personal data, request deletion, or opt out of marketing communications.</li>
          </ul>
        </div>
        
        <p className="text-gray-300">
          For any privacy-related inquiries, contact us at <a href="https://discord.gg/c4arcAJrU5" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://discord.gg/c4arcAJrU5</a>
        </p>
      </div>
    </Layout>
  );
};

export default Privacy;
