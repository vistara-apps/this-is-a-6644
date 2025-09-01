import React, { useState } from 'react';
import { Camera, FileText, BarChart3, CreditCard, Settings, User, Menu, X } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'claims', name: 'Process Claims', icon: Camera },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'pricing', name: 'Pricing', icon: CreditCard },
  ];

  const handleNavigation = (pageId: string) => {
    onNavigate(pageId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen bg-bg flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-surface shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">ClaimSnap</h1>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="w-6 h-6 text-text-primary" />
        </button>
      </div>

      {/* Sidebar - Desktop (fixed) and Mobile (overlay) */}
      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed md:static top-0 left-0 h-full z-40 
          w-3/4 md:w-64 bg-surface shadow-lg flex flex-col
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">ClaimSnap</h1>
              <p className="text-sm text-text-secondary">Insurance Photos</p>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button 
            className="md:hidden p-1 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4" aria-label="Main navigation">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-primary text-white'
                        : 'text-text-primary hover:bg-gray-100'
                    }`}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">John Adjuster</p>
              <p className="text-xs text-text-secondary">Pro Plan</p>
            </div>
            <Settings className="w-4 h-4 text-text-secondary" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-20">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center py-3 px-2 flex-1 ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
