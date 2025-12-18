import React from 'react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="cart empty-cart">
        <h3>Your Cart</h3>
        <p>No items in cart</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h3>Your Cart ({items.length} items)</h3>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item._id} className="cart-item">
            <div className="item-info">
              <h4>{item.name}</h4>
              <span className="item-price">${item.price.toFixed(2)}</span>
            </div>
            
            <div className="quantity-controls">
              <button 
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}>
                +
              </button>
            </div>
            
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              onClick={() => onRemoveItem(item._id)}
              className="remove-btn"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
        <button onClick={onCheckout} className="checkout-btn">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;