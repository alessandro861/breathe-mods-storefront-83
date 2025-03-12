
import React from 'react';
import Layout from '@/components/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
        
        <p className="text-gray-300 mb-6">Last updated: [12/03/2025]</p>
        
        <p className="text-gray-300 mb-6">
          Welcome to Breathe! By using our website and purchasing our DayZ mods, you agree to comply with and be bound by the following Terms of Service. If you do not agree with these terms, please do not use our website.
        </p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">1. General Terms</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>Breathe provides digital products (mods) for DayZ. All sales are final, and refunds are only granted under exceptional circumstances.</li>
            <li>You may not redistribute, resell, or modify our mods without explicit permission.</li>
            <li>We reserve the right to modify or discontinue any mod without prior notice.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">2. Purchases & Payments</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>Payments are processed through secure third-party payment providers.</li>
            <li>You are responsible for ensuring that you have the necessary permissions to use our mods on your DayZ server.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">3. User Conduct</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>You agree not to use our mods for illegal or unethical activities.</li>
            <li>Any attempts to reverse-engineer or exploit our mods will result in a permanent ban from our services.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">4. Liability Disclaimer</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>Breathe is not responsible for any damages, server issues, or data loss resulting from the use of our mods.</li>
            <li>Mods are provided "as-is" without warranties of any kind.</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-white">5. Changes to Terms</h2>
          <ul className="text-gray-300 space-y-2 pl-4">
            <li>We reserve the right to update these Terms of Service at any time. Continued use of our services after updates constitutes acceptance of the revised terms.</li>
          </ul>
        </div>
        
        <p className="text-gray-300">
          For any questions, contact us at <a href="https://discord.gg/c4arcAJrU5" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://discord.gg/c4arcAJrU5</a>
        </p>
      </div>
    </Layout>
  );
};

export default Terms;
