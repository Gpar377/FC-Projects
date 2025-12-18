import React, { useState } from 'react';
import { authAPI } from '../services/api';

interface RegisterProps {
  onLogin: (token: string) => void;
  switchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin, switchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

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

        <button type="submit">Register</button>
        
        <p>
          Already have an account? 
          <button type="button" onClick={switchToLogin}>Login</button>
        </p>
      </form>
    </div>
  );
};

export default Register;