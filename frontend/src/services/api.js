import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Expense APIs
export const expenseAPI = {
  create: (data) => api.post('/expenses', data),
  submit: (id) => api.post(`/expenses/${id}/submit`),
  getAll: () => api.get('/expenses'),
  getById: (id) => api.get(`/expenses/${id}`),
  getApprovalHistory: (id) => api.get(`/expenses/${id}/approvals`),
  uploadReceipt: (id, formData) => 
    api.post(`/expenses/${id}/receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  convertCurrency: (data) => api.post('/expenses/convert-currency', data),
};

// Approval APIs
export const approvalAPI = {
  getPending: () => api.get('/approvals/pending'),
  approve: (levelId, data) => api.post(`/approvals/${levelId}/approve`, data),
  reject: (levelId, data) => api.post(`/approvals/${levelId}/reject`, data),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getStats: (params) => api.get('/dashboard/stats', { params }),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: (lastCheck) => 
    api.get('/notifications', { params: { lastCheck } }),
};

export default api;
