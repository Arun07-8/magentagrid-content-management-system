import React, { useState } from 'react';
import { AdminSidebar, type AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export interface AdminLayoutProps {
  children: React.ReactNode;
  currentTab?: AdminTab;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  showSearch?: boolean;
}

export function AdminLayout({
  children,
  currentTab,
  searchQuery,
  onSearchChange,
  showSearch = true,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      <AdminSidebar
        currentTab={currentTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          showSearch={showSearch}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
