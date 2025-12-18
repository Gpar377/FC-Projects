import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  cancelledOrders: number;
  activeOrders: number;
  averageOrderValue: number;
  completionRate: string;
  revenueByStatus: {
    completed: number;
    cancelled: number;
    pending: number;
  };
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await orderAPI.getAnalytics(dateRange.startDate, dateRange.endDate);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-dashboard">
      <h2>Sales Analytics</h2>
      
      <div className="date-filters">
        <input 
          type="date" 
          value={dateRange.startDate}
          onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
        />
        <span>to</span>
        <input 
          type="date" 
          value={dateRange.endDate}
          onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
        />
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{analytics.totalOrders}</p>
        </div>

        <div className="analytics-card revenue">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="analytics-card">
          <h3>Completed Orders</h3>
          <p className="stat-value">{analytics.completedOrders}</p>
          <span className="stat-label">{analytics.completionRate}% completion rate</span>
        </div>

        <div className="analytics-card">
          <h3>Active Orders</h3>
          <p className="stat-value">{analytics.activeOrders}</p>
        </div>

        <div className="analytics-card">
          <h3>Cancelled Orders</h3>
          <p className="stat-value cancelled">{analytics.cancelledOrders}</p>
        </div>

        <div className="analytics-card">
          <h3>Average Order Value</h3>
          <p className="stat-value">₹{analytics.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="revenue-breakdown">
        <h3>Revenue Breakdown</h3>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <span>Completed</span>
            <span className="amount">₹{analytics.revenueByStatus.completed.toFixed(2)}</span>
          </div>
          <div className="breakdown-item">
            <span>Pending</span>
            <span className="amount">₹{analytics.revenueByStatus.pending.toFixed(2)}</span>
          </div>
          <div className="breakdown-item">
            <span>Cancelled</span>
            <span className="amount cancelled">₹{analytics.revenueByStatus.cancelled.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
