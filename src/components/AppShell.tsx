import React from 'react';
import { Camera, FileText, BarChart3, CreditCard, Settings, User, Menu } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'claims', name: 'Process Claims', icon: Camera },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'pricing', name: 'Pricing', icon: CreditCard },
  ];

  return (
    <div className="h-screen bg-bg flex">
      {/* Sidebar */}
      <div className="w-64 bg-surface shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">ClaimSnap</h1>
              <p className="text-sm text-text-secondary">Insurance Photos</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-primary text-white'
                        : 'text-text-primary hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
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
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">John Adjuster</p>
              <p className="text-xs text-text-secondary">Pro Plan</p>
            </div>
            <Settings className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}