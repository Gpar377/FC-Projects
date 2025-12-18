import React, { useState } from 'react';
import { authAPI } from '../services/api';

interface LoginProps {
  onLogin: (token: string) => void;
  switchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, switchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button type="submit">Login</button>
        
        <p>
          Don't have an account? 
          <button type="button" onClick={switchToRegister}>Register</button>
        </p>
      </form>
    </div>
  );
};

export default Login;