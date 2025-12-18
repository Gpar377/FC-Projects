import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { transactionAPI } from '../services/api';
import socketService from '../services/socket';

interface Analytics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryData: { [key: string]: number };
  monthlyData: Array<{ month: string; income: number; expenses: number; }>;
}

const EnhancedDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [prevAnalytics, setPrevAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetchAnalytics();
    
    socketService.connect();
    socketService.onTransactionAdded(() => fetchAnalytics());
    socketService.onTransactionDeleted(() => fetchAnalytics());
    
    return () => {
      socketService.off('transaction-added');
      socketService.off('transaction-deleted');
    };
  }, [timeRange]);

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    if (timeRange === 'week') start.setDate(end.getDate() - 7);
    else if (timeRange === 'month') start.setMonth(end.getMonth() - 1);
    else start.setFullYear(end.getFullYear() - 1);
    
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  const fetchAnalytics = async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const response = await transactionAPI.getAnalytics(startDate, endDate);
      
      // Fetch previous period for comparison
      const prevStart = new Date(startDate);
      const prevEnd = new Date(startDate);
      if (timeRange === 'week') prevStart.setDate(prevStart.getDate() - 7);
      else if (timeRange === 'month') prevStart.setMonth(prevStart.getMonth() - 1);
      else prevStart.setFullYear(prevStart.getFullYear() - 1);
      
      const prevResponse = await transactionAPI.getAnalytics(prevStart.toISOString(), prevEnd.toISOString());
      
      setAnalytics(response.data);
      setPrevAnalytics(prevResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!analytics) return <div className="loading-spinner">Loading Dashboard...</div>;

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return '+0.0';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}`;
  };

  const incomeChange = prevAnalytics ? calculateChange(analytics.totalIncome, prevAnalytics.totalIncome) : '+0.0';
  const expenseChange = prevAnalytics ? calculateChange(analytics.totalExpenses, prevAnalytics.totalExpenses) : '+0.0';
  const balanceChange = prevAnalytics ? calculateChange(analytics.balance, prevAnalytics.balance) : '+0.0';

  const pieData = Object.entries(analytics.categoryData).map(([name, value]) => ({ 
    name, 
    value,
    percentage: ((value / analytics.totalExpenses) * 100).toFixed(1)
  }));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  const formatCurrency = (amount: number) => 
    `₹${amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const savingsRate = analytics.totalIncome > 0 ? 
    ((analytics.balance / analytics.totalIncome) * 100).toFixed(1) : '0';

  return (
    <div className="enhanced-dashboard">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <div className="time-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card income-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Income</h3>
            <p className="metric-value">{formatCurrency(analytics.totalIncome)}</p>
            <span className={`metric-change ${incomeChange.startsWith('+') ? 'positive' : 'negative'}`}>{incomeChange}% from last period</span>
          </div>
        </div>

        <div className="metric-card expense-card">
          <div className="metric-icon">💸</div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <p className="metric-value">{formatCurrency(analytics.totalExpenses)}</p>
            <span className={`metric-change ${expenseChange.startsWith('-') ? 'positive' : 'negative'}`}>{expenseChange}% from last period</span>
          </div>
        </div>

        <div className="metric-card balance-card">
          <div className="metric-icon">🏦</div>
          <div className="metric-content">
            <h3>Net Balance</h3>
            <p className={`metric-value ${analytics.balance >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(analytics.balance)}
            </p>
            <span className={`metric-change ${balanceChange.startsWith('+') ? 'positive' : 'negative'}`}>{balanceChange}% from last period</span>
          </div>
        </div>

        <div className="metric-card savings-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Savings Rate</h3>
            <p className="metric-value">{savingsRate}%</p>
            <span className="metric-change">Target: 20%</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Income vs Expenses Trend */}
        <div className="chart-container large">
          <h3>Income vs Expenses Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={analytics.monthlyData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#4ECDC4" 
                fillOpacity={1} 
                fill="url(#incomeGradient)"
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#FF6B6B" 
                fillOpacity={1} 
                fill="url(#expenseGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-container medium">
          <h3>Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, value}) => {
                  const percentage = ((value / analytics.totalExpenses) * 100).toFixed(1);
                  return `${name}: ${percentage}%`;
                }}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Comparison Bar Chart */}
        <div className="chart-container medium">
          <h3>Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#4ECDC4" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#FF6B6B" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Savings Progress */}
        <div className="chart-container small">
          <h3>Savings Goal Progress</h3>
          <div className="savings-progress">
            <div className="progress-circle">
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[
                  { name: 'Savings', value: Number(savingsRate), fill: '#4ECDC4' }
                ]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#4ECDC4" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="progress-text">
                <span className="progress-percentage">{savingsRate}%</span>
                <span className="progress-label">Savings Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="chart-container small">
          <h3>Quick Statistics</h3>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Avg. Daily Expense</span>
              <span className="stat-value">{formatCurrency(analytics.totalExpenses / 30)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Highest Category</span>
              <span className="stat-value">
                {Object.keys(analytics.categoryData).reduce((a, b) => 
                  analytics.categoryData[a] > analytics.categoryData[b] ? a : b, ''
                )}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Transactions</span>
              <span className="stat-value">
                {Object.keys(analytics.categoryData).length} categories
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;