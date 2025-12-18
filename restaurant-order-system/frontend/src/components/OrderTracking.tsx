import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import socketService from '../services/socket';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  estimatedTime: number;
  createdAt: string;
  items: Array<{
    menuItem: { name: string; price: number };
    quantity: number;
  }>;
}

const OrderTracking: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
    
    // Connect to socket for real-time updates
    socketService.connect();
    socketService.onOrderStatusUpdate((data) => {
      setOrders(prev => prev.map(order => 
        order._id === data.orderId 
          ? { ...order, status: data.status }
          : order
      ));
    });

    return () => {
      socketService.off('order-status-update');
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderAPI.cancelOrder(orderId);
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order');
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'placed': return 'Order Placed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="order-tracking">
      <h2>My Orders</h2>
      
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.orderNumber}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              
              {order.status === 'placed' && (
                <button 
                  onClick={() => handleCancelOrder(order._id)}
                  className="cancel-order-btn"
                >
                  Cancel Order
                </button>
              )}
              
              <div className="order-details">
                <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                <p><strong>Estimated Time:</strong> {order.estimatedTime} minutes</p>
                <p><strong>Ordered:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <span>₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="status-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: order.status === 'placed' ? '25%' :
                             order.status === 'preparing' ? '50%' :
                             order.status === 'ready' ? '75%' :
                             order.status === 'completed' ? '100%' : '0%'
                    }}
                  />
                </div>
                <div className="progress-labels">
                  <span>Placed</span>
                  <span>Preparing</span>
                  <span>Ready</span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;