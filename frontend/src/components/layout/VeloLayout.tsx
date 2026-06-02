import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface VeloLayoutProps {
  children: React.ReactNode;
}

const VeloLayout: React.FC<VeloLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-velo-light">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default VeloLayout;
