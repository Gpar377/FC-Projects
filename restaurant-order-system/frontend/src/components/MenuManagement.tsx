import React, { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  preparationTime: number;
  available: boolean;
}

const MenuManagement: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    available: true
  });

  const categories = ['Main Course', 'South Indian', 'North Indian', 'Chinese', 'Starters', 'Snacks', 'Desserts', 'Beverages'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await menuAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime)
      };

      if (editingItem) {
        await menuAPI.update(editingItem._id, itemData);
      } else {
        await menuAPI.create(itemData);
      }

      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      preparationTime: item.preparationTime.toString(),
      available: item.available
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await menuAPI.delete(id);
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      preparationTime: '',
      available: true
    });
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div className="menu-management">
      <div className="menu-header">
        <h2>Menu Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="add-item-btn"
        >
          Add New Item
        </button>
      </div>

      {showForm && (
        <div className="menu-form-overlay">
          <div className="menu-form">
            <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prep Time (min):</label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  />
                  Available
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm}>Cancel</button>
                <button type="submit">{editingItem ? 'Update' : 'Add'} Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="menu-items-grid">
        {items.map(item => (
          <div key={item._id} className="menu-item-admin">
            <div className="item-header">
              <h4>{item.name}</h4>
              <span className={`status ${item.available ? 'available' : 'unavailable'}`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            <p className="item-description">{item.description}</p>
            
            <div className="item-details">
              <span className="category">{item.category}</span>
              <span className="price">₹{item.price}</span>
              <span className="prep-time">{item.preparationTime} min</span>
            </div>
            
            <div className="item-actions">
              <button onClick={() => handleEdit(item)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(item._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;