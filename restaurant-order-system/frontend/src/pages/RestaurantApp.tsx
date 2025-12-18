import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RestaurantAppProps {
  onBack: () => void;
}

const RestaurantApp: React.FC<RestaurantAppProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('restaurant_token');
    const userData = localStorage.getItem('restaurant_user');
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'admin') {
        setUser(parsedUser);
        setShowLogin(false);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authAPI.login(loginData);
      
      if (response.data.user.role !== 'admin') {
        setError('Access denied. Restaurant admin credentials required.');
        return;
      }
      
      localStorage.setItem('restaurant_token', response.data.token);
      localStorage.setItem('restaurant_user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setShowLogin(false);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurant_token');
    localStorage.removeItem('restaurant_user');
    setUser(null);
    setShowLogin(true);
    setError('');
  };

  if (showLogin) {
    return (
      <div className="restaurant-auth">
        <div className="auth-header">
          <button onClick={onBack} className="back-btn">← Back to Portal Selection</button>
          <h1>🏪 Restaurant Portal</h1>
        </div>
        
        <div className="auth-container">
          <form onSubmit={handleLogin} className="auth-form restaurant-form">
            <h2>Restaurant Admin Login</h2>
            <p className="auth-subtitle">Access restaurant management dashboard</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <input
              type="email"
              placeholder="Admin Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            
            <button type="submit" className="auth-submit-btn restaurant-submit">
              Access Dashboard
            </button>
            
            <div className="demo-credentials">
              <p><strong>Demo Credentials:</strong></p>
              <p>Email: admin@restaurant.com</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-app">
      <header className="restaurant-header">
        <div className="header-left">
          <button onClick={onBack} className="back-btn">← Back</button>
          <h1>🏪 Restaurant Dashboard</h1>
        </div>
        <div className="header-right">
          <span>Admin: {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="restaurant-main">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default RestaurantApp;