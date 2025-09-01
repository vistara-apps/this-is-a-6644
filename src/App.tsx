import React, { useState } from 'react';
import { AppShell } from './components/AppShell';
import { Dashboard } from './pages/Dashboard';
import { ClaimProcessor } from './pages/ClaimProcessor';
import { Reports } from './pages/Reports';
import { Pricing } from './pages/Pricing';
import { PhotoProvider } from './context/PhotoContext';

type Page = 'dashboard' | 'claims' | 'reports' | 'pricing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'claims':
        return <ClaimProcessor />;
      case 'reports':
        return <Reports />;
      case 'pricing':
        return <Pricing />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <PhotoProvider>
      <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </AppShell>
    </PhotoProvider>
  );
}

export default App;