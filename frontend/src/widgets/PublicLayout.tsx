import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { PageCtaSection } from '../entities/page';

export interface PublicLayoutProps {
  children: React.ReactNode;
  footerContent?: PageCtaSection;
  showContactSection?: boolean;
}

export function PublicLayout({
  children,
  footerContent,
  showContactSection = true,
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer content={footerContent} showContactSection={showContactSection} />
    </div>
  );
}

