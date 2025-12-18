import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

const BudgetManager: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: new Date().toISOString().slice(0, 7)
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets', { params: { month: formData.month } });
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { ...formData, limit: parseFloat(formData.limit) });
      setFormData({ category: '', limit: '', month: formData.month });
      setShowForm(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return '#e74c3c';
    if (percentage >= 80) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div className="budget-manager">
      <div className="budget-header">
        <h3>Budget Goals</h3>
        <div className="budget-controls">
          <input 
            type="month" 
            value={formData.month} 
            onChange={(e) => {
              setFormData({...formData, month: e.target.value});
              setTimeout(fetchBudgets, 100);
            }}
          />
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Budget'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="budget-form">
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
          <input 
            type="number" 
            placeholder="Budget Limit" 
            value={formData.limit}
            onChange={(e) => setFormData({...formData, limit: e.target.value})}
            required
          />
          <button type="submit">Create Budget</button>
        </form>
      )}

      <div className="budget-list">
        {budgets.length === 0 ? (
          <p className="no-budgets">No budgets set for this month. Create one to track your spending!</p>
        ) : (
          budgets.map(budget => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const remaining = budget.limit - budget.spent;
            
            return (
              <div key={budget._id} className="budget-item">
                <div className="budget-info">
                  <h4>{budget.category}</h4>
                  <div className="budget-amounts">
                    <span className="spent">₹{budget.spent.toLocaleString('en-IN')}</span>
                    <span className="separator">/</span>
                    <span className="limit">₹{budget.limit.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="budget-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getProgressColor(budget.spent, budget.limit)
                      }}
                    />
                  </div>
                  <div className="budget-stats">
                    <span className={remaining >= 0 ? 'remaining' : 'over'}>
                      {remaining >= 0 ? `₹${remaining.toLocaleString('en-IN')} left` : `₹${Math.abs(remaining).toLocaleString('en-IN')} over`}
                    </span>
                    <span className="percentage">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <button onClick={() => deleteBudget(budget._id)} className="delete-budget">🗑️</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
