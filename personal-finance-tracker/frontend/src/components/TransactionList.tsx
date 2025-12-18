import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import socketService from '../services/socket';
import jsPDF from 'jspdf';

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface TransactionListProps {
  refresh: boolean;
  onRefreshComplete: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ refresh, onRefreshComplete }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [filters, setFilters] = useState({ category: '', type: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTransactions();
    
    // Connect to socket for real-time updates
    socketService.connect();
    
    socketService.onTransactionAdded(() => {
      fetchTransactions(); // Refresh list when transaction added
    });
    
    socketService.onTransactionDeleted(() => {
      fetchTransactions(); // Refresh list when transaction deleted
    });
    
    return () => {
      socketService.off('transaction-added');
      socketService.off('transaction-deleted');
    };
  }, [refresh]);

  const fetchTransactions = async () => {
    try {
      const hasFilters = filters.category || filters.type || filters.startDate || filters.endDate;
      const response = hasFilters ? await transactionAPI.search(filters) : await transactionAPI.getAll();
      setTransactions(response.data);
      onRefreshComplete();
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
  };

  const saveEdit = async () => {
    try {
      await transactionAPI.update(editingId!, editForm);
      setEditingId(null);
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const applyFilters = () => {
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilters({ category: '', type: '', startDate: '', endDate: '' });
    setTimeout(() => fetchTransactions(), 100);
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionAPI.delete(id);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction Report', 20, 20);
    
    let y = 40;
    transactions.forEach((transaction, index) => {
      const text = `${transaction.date} - ${transaction.type.toUpperCase()} - ₹${transaction.amount} - ${transaction.category}`;
      doc.text(text, 20, y + (index * 10));
    });
    
    doc.save('transactions.pdf');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'Category', 'Description'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.type,
        t.amount,
        t.category,
        t.description || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  const categories = {
    expense: ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h3>Recent Transactions</h3>
        <div className="header-actions">
          <button onClick={() => setShowFilters(!showFilters)} className="filter-btn">
            {showFilters ? '✕ Hide Filters' : '🔍 Filters'}
          </button>
          <button onClick={exportToCSV}>Export CSV</button>
          <button onClick={exportToPDF}>Export PDF</button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
            <option value="">All Categories</option>
            {[...categories.income, ...categories.expense].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} placeholder="Start Date" />
          <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} placeholder="End Date" />
          <button onClick={applyFilters} className="apply-btn">Apply</button>
          <button onClick={clearFilters} className="clear-btn">Clear</button>
        </div>
      )}

      <div className="transactions">
        {transactions.map((transaction) => (
          <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
            {editingId === transaction._id ? (
              <div className="edit-form">
                <input type="number" value={editForm.amount} onChange={(e) => setEditForm({...editForm, amount: e.target.value})} />
                <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})}>
                  {categories[editForm.type as keyof typeof categories].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input type="text" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
                <input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} />
                <button onClick={saveEdit} className="save-btn">✓ Save</button>
                <button onClick={cancelEdit} className="cancel-btn">✕ Cancel</button>
              </div>
            ) : (
              <>
                <div className="transaction-info">
                  <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
                  <span className="category">{transaction.category}</span>
                  <span className="description">{transaction.description}</span>
                </div>
                <div className="transaction-amount">
                  <span className={transaction.type}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </span>
                  <button onClick={() => startEdit(transaction)} className="edit-btn">Edit</button>
                  <button onClick={() => deleteTransaction(transaction._id)} className="delete-btn">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;