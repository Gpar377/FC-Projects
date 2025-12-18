import React, { useState } from 'react';
import { transactionAPI } from '../services/api';

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    expense: ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionAPI.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      onTransactionAdded();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>Add Transaction</h3>
      
      <div className="form-group">
        <label>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-group">
        <label>Amount:</label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Category:</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories[formData.type as keyof typeof categories].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;