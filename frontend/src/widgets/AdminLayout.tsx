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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#F4F5F8] text-[#2A3039] antialiased p-3 sm:p-4 lg:p-5 selection:bg-zinc-900 selection:text-white admin-scope">
      <div className="max-w-[1720px] mx-auto flex gap-4 lg:gap-5 min-h-[calc(100vh-2.5rem)] lg:h-[calc(100vh-2.5rem)]">
        {/* Floating Sidebar (Desktop & Mobile Drawer) */}
        <AdminSidebar
          currentTab={currentTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 lg:h-full">
          {/* Floating Pill Header - only shown if search enabled or on mobile for menu toggle */}
          {showSearch ? (
            <div className="mb-4 lg:mb-5">
              <AdminHeader
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                showSearch={showSearch}
                onToggleMobileMenu={() => setMobileMenuOpen(true)}
              />
            </div>
          ) : (
            <div className="lg:hidden mb-3">
              <AdminHeader
                showSearch={false}
                onToggleMobileMenu={() => setMobileMenuOpen(true)}
              />
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 lg:h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

