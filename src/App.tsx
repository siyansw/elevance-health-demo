import { useState } from 'react';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { PTCommittee } from './components/use-cases/PTCommittee';
import { PriorAuth } from './components/use-cases/PriorAuth';
import { ExecutionModal } from './components/modals/ExecutionModal';

type View = 'login' | 'dashboard' | 'pt-committee' | 'prior-auth';
type ExecutionMode = 'demo' | 'live';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [executionModalOpen, setExecutionModalOpen] = useState(false);
  const [currentExecutionMode, setCurrentExecutionMode] = useState<ExecutionMode>('demo');
  const [currentUseCaseTitle, setCurrentUseCaseTitle] = useState('');

  const handleLogin = (password: string) => {
    // Simple demo authentication - accept any password
    if (password.trim()) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleSelectUseCase = (useCaseId: string) => {
    if (useCaseId === 'pt-committee') {
      setCurrentView('pt-committee');
    } else if (useCaseId === 'prior-auth') {
      setCurrentView('prior-auth');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleExecute = (mode: ExecutionMode, useCaseTitle: string) => {
    setCurrentExecutionMode(mode);
    setCurrentUseCaseTitle(useCaseTitle);
    setExecutionModalOpen(true);
  };

  const handleCloseExecutionModal = () => {
    setExecutionModalOpen(false);
  };

  return (
    <>
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {currentView === 'dashboard' && isAuthenticated && (
        <Dashboard
          onSelectUseCase={handleSelectUseCase}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'pt-committee' && isAuthenticated && (
        <PTCommittee
          onBack={handleBackToDashboard}
          onExecute={(mode) => handleExecute(mode, 'P&T Committee Intelligence')}
        />
      )}

      {currentView === 'prior-auth' && isAuthenticated && (
        <PriorAuth
          onBack={handleBackToDashboard}
          onExecute={(mode) => handleExecute(mode, 'Prior Authorization Intelligence')}
        />
      )}

      <ExecutionModal
        isOpen={executionModalOpen}
        onClose={handleCloseExecutionModal}
        useCaseTitle={currentUseCaseTitle}
        mode={currentExecutionMode}
      />
    </>
  );
}

export default App;
