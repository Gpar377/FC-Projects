import React from 'react';

interface LandingPageProps {
  onSelectMode: (mode: 'customer' | 'restaurant') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <h1>Campus Canteen</h1>
          <p>Choose your access portal</p>
        </div>

        <div className="portal-selection">
          <div className="portal-card customer-portal" onClick={() => onSelectMode('customer')}>
            <div className="portal-icon">Customer</div>
            <h2>Customer Portal</h2>
            <p>Browse menu, place orders, and track your food</p>
            <ul>
              <li>Browse delicious menu</li>
              <li>Add items to cart</li>
              <li>Place orders instantly</li>
              <li>Real-time order tracking</li>
              <li>Order history</li>
            </ul>
            <button className="portal-btn customer-btn">Enter as Customer</button>
          </div>

          <div className="portal-card restaurant-portal" onClick={() => onSelectMode('restaurant')}>
            <div className="portal-icon">Restaurant</div>
            <h2>Restaurant Portal</h2>
            <p>Manage orders, menu, and restaurant operations</p>
            <ul>
              <li>Manage incoming orders</li>
              <li>Update order status</li>
              <li>Menu management</li>
              <li>Real-time notifications</li>
              <li>Analytics dashboard</li>
            </ul>
            <button className="portal-btn restaurant-btn">Enter as Restaurant</button>
          </div>
        </div>

        <div className="landing-footer">
          <p>Real-time ordering system with live updates</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;