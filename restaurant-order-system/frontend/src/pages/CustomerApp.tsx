import React, { useState, useEffect } from 'react';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';
import OrderTracking from '../components/OrderTracking';
import { authAPI, orderAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerAppProps {
  onBack: () => void;
}

const CustomerApp: React.FC<CustomerAppProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const userData = localStorage.getItem('customer_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setShowLogin(false);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = isRegister 
        ? await authAPI.register(authData)
        : await authAPI.login({ email: authData.email, password: authData.password });
      
      localStorage.setItem('customer_token', response.data.token);
      localStorage.setItem('customer_user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setShowLogin(false);
    } catch (error) {
      console.error('Auth failed:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    setUser(null);
    setShowLogin(true);
    setCart([]);
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem._id === item._id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item =>
      item._id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      await orderAPI.create(orderData);
      setCart([]);
      setActiveTab('orders');
      alert('🎉 Order placed successfully! Track your order in the Orders tab.');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Order failed. Please try again.');
    }
  };

  if (showLogin) {
    return (
      <div className="customer-auth">
        <div className="auth-header">
          <button onClick={onBack} className="back-btn">← Back to Portal Selection</button>
          <h1>👥 Customer Portal</h1>
        </div>
        
        <div className="auth-container">
          <form onSubmit={handleAuth} className="auth-form">
            <h2>{isRegister ? 'Create Account' : 'Customer Login'}</h2>
            
            {isRegister && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authData.name}
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Student ID (Optional)"
                  value={authData.studentId}
                  onChange={(e) => setAuthData({ ...authData, studentId: e.target.value })}
                />
              </>
            )}
            
            <input
              type="email"
              placeholder="Email Address"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              required
            />
            
            <button type="submit" className="auth-submit-btn">
              {isRegister ? 'Create Account' : 'Login'}
            </button>
            
            <p className="auth-switch">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button 
                type="button" 
                onClick={() => setIsRegister(!isRegister)}
                className="switch-btn"
              >
                {isRegister ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-app">
      <header className="customer-header">
        <div className="header-left">
          <button onClick={onBack} className="back-btn">← Back</button>
          <h1>🍽️ Campus Canteen</h1>
        </div>
        <div className="header-right">
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="customer-nav">
        <button 
          className={activeTab === 'menu' ? 'active' : ''}
          onClick={() => setActiveTab('menu')}
        >
          🍕 Menu ({cart.length})
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          📋 My Orders
        </button>
      </nav>

      <main className="customer-main">
        {activeTab === 'menu' && (
          <div className="menu-page">
            <div className="menu-content">
              <MenuList onAddToCart={addToCart} />
            </div>
            <div className="cart-sidebar">
              <Cart
                items={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        {activeTab === 'orders' && <OrderTracking />}
      </main>
    </div>
  );
};

export default CustomerApp;