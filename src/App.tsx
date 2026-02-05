import { useState } from 'react';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';

type View = 'login' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <>
      {currentView === 'login' && <Login onLogin={handleLogin} />}

      {currentView === 'dashboard' && isAuthenticated && <Dashboard onLogout={handleLogout} />}
    </>
  );
}

export default App;
