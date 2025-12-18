import React, { useState, useEffect } from 'react';
import EnhancedDashboard from './components/EnhancedDashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetManager from './components/BudgetManager';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import './enhanced-dashboard.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [refreshTransactions, setRefreshTransactions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleTransactionAdded = () => {
    // Real-time updates handled by Socket.io, no manual refresh needed
  };

  const handleRefreshComplete = () => {
    setRefreshTransactions(false);
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onLogin={handleLogin} 
        switchToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <Login 
        onLogin={handleLogin} 
        switchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Personal Finance Tracker</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="app-main">
        <EnhancedDashboard />
        
        <BudgetManager />
        
        <div className="content-grid">
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
          <TransactionList 
            refresh={refreshTransactions} 
            onRefreshComplete={handleRefreshComplete} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;