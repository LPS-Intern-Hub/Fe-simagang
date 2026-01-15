import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard APIs
export const getDashboard = () => api.get('/dashboard');
export const getDashboardStats = () => api.get('/dashboard/stats');

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');

// Permission APIs
export const getPermissions = (params) => api.get('/permissions', { params });
export const getPermissionById = (id) => api.get(`/permissions/${id}`);
export const createPermission = (data) => api.post('/permissions', data);
export const updatePermission = (id, data) => api.put(`/permissions/${id}`, data);
export const deletePermission = (id) => api.delete(`/permissions/${id}`);

// Presence APIs
export const getTodayPresence = () => api.get('/presences/today');
export const getPresences = (params) => api.get('/presences', { params });
export const checkIn = (formData) => api.post('/presences/check-in', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const checkOut = () => api.post('/presences/check-out');

// Logbook APIs
export const getLogbooks = (params) => api.get('/logbooks', { params });
export const getLogbookById = (id) => api.get(`/logbooks/${id}`);
export const createLogbook = (data) => api.post('/logbooks', data);
export const updateLogbook = (id, data) => api.put(`/logbooks/${id}`, data);
export const deleteLogbook = (id) => api.delete(`/logbooks/${id}`);
export const getLogbookStats = () => api.get('/logbooks/stats');

export default api;