import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { transactionAPI } from '../services/api';

interface Analytics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryData: { [key: string]: number };
}

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await transactionAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!analytics) return <div>Loading...</div>;

  const pieData = Object.entries(analytics.categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="dashboard">
      <h2>Financial Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Income</h3>
          <p className="income">₹{analytics.totalIncome.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="expense">₹{analytics.totalExpenses.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
        </div>
        <div className="stat-card">
          <h3>Balance</h3>
          <p className={analytics.balance >= 0 ? 'positive' : 'negative'}>
            ₹{analytics.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
          </p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;