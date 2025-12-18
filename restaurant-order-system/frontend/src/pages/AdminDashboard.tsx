import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import socketService from '../services/socket';
import MenuManagement from '../components/MenuManagement';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  user: { name: string; email: string };
  items: Array<{
    menuItem: { name: string };
    quantity: number;
  }>;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  useEffect(() => {
    fetchOrders();
    
    // Connect to socket and join admin room
    socketService.connect();
    socketService.joinAdmin();
    
    socketService.onNewOrder((order) => {
      setOrders(prev => [order, ...prev]);
    });

    return () => {
      socketService.off('new-order');
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return '#f39c12';
      case 'preparing': return '#3498db';
      case 'ready': return '#27ae60';
      case 'completed': return '#95a5a6';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={activeTab === 'menu' ? 'active' : ''}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>Order Management</h2>
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="admin-order-card">
                <div className="order-header">
                  <h3>#{order.orderNumber}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                
                <div className="customer-info">
                  <p><strong>Customer:</strong> {order.user.name}</p>
                  <p><strong>Email:</strong> {order.user.email}</p>
                  <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items.map((item, index) => (
                    <p key={index}>{item.quantity}x {item.menuItem.name}</p>
                  ))}
                </div>
                
                <div className="status-controls">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="placed">Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <MenuManagement />
      )}
    </div>
  );
};

export default AdminDashboard;