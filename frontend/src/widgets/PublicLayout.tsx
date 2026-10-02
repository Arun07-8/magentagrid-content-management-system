import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
