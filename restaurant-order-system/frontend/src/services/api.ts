import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const menuAPI = {
  getAll: (params?: any) => api.get('/menu', { params }),
  create: (data: any) => api.post('/menu', data),
  update: (id: string, data: any) => api.put(`/menu/${id}`, data),
  delete: (id: string) => api.delete(`/menu/${id}`),
};

export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
  getAnalytics: (startDate?: string, endDate?: string) => 
    api.get('/orders/analytics/stats', { params: { startDate, endDate } }),
};

export default api;