import React, { useState } from 'react';
import HomePage from './components/HomePage';
import { Login, Signup, SuccessScreen } from './components/Auth';
import Dashboard from './components/Dashboard';
import Docs from './components/Docs';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState('login'); // 'login', 'signup', 'success'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'dashboard', 'docs'

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setAuthStep('success');
  };

  const handleSuccessContinue = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthStep('login');
    setCurrentPage('home');
  };

  const switchToSignup = () => setAuthStep('signup');
  const switchToLogin = () => setAuthStep('login');

  const navigateToLogin = () => {
    setCurrentPage('login');
    setAuthStep('login');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToDocs = () => {
    setCurrentPage('docs');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToLogin={navigateToLogin} onNavigateToDocs={navigateToDocs} />;
      case 'docs':
        return <Docs onNavigateHome={navigateToHome} />;
      case 'login':
        if (!isAuthenticated) {
          if (authStep === 'login') {
            return <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />;
          } else if (authStep === 'signup') {
            return <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />;
          } else {
            return <SuccessScreen user={user} onContinue={handleSuccessContinue} />;
          }
        } else {
          return <Dashboard user={user} onLogout={handleLogout} />;
        }
      case 'dashboard':
        return isAuthenticated ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
        );
      default:
        return <HomePage onNavigateToLogin={navigateToLogin} onNavigateToDocs={navigateToDocs} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
