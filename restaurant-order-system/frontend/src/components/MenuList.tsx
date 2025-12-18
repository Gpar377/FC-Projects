import React, { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  preparationTime: number;
}

interface MenuListProps {
  onAddToCart: (item: MenuItem) => void;
}

const MenuList: React.FC<MenuListProps> = ({ onAddToCart }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMenuItems = async () => {
    try {
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await menuAPI.getAll(params);
      setItems(response.data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(response.data.map((item: MenuItem) => item.category))) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="menu-list">
      <div className="menu-filters">
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="menu-grid">
        {items.map(item => (
          <div key={item._id} className="menu-item-card">
            {item.image && (
              <img src={item.image} alt={item.name} className="item-image" />
            )}
            <div className="item-content">
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>
              <div className="item-details">
                <span className="price">${item.price.toFixed(2)}</span>
                <span className="prep-time">{item.preparationTime} min</span>
              </div>
              <button 
                onClick={() => onAddToCart(item)}
                className="add-to-cart-btn"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;