import axios from 'axios';

/**
 * Make sure your .env file contains:
 * VITE_API_URL=http://localhost:3000/api
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the Bearer Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 (token invalid/expired) → auto redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login/reset/landing pages
      const path = window.location.pathname;
      const publicPaths = ['/', '/login', '/reset-password', '/new-password'];
      if (!publicPaths.some(p => path === p || path.startsWith(p + '/'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.replace('/login');
        // Return a pending promise to prevent error from propagating to UI
        return new Promise(() => {});
      }
    }
    return Promise.reject(error);
  }
);

// --- DASHBOARD APIs ---
export const getDashboardData = () => api.get('/dashboard');
export const getDashboard = () => api.get('/dashboard');
export const getDashboardStats = () => api.get('/dashboard/stats');

// --- AUTH APIs ---
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email });
export const verifyResetToken = (token) => api.get(`/auth/verify-reset-token/${token}`);
export const resetPassword = (token, newPassword) => api.post('/auth/reset-password', { token, newPassword });
export const getProfile = () => api.get('/auth/me');
export const changePassword = (data) => api.put('/auth/change-password', data);
export const updateProfile = (data) => api.put('/auth/update-profile', data);


// --- PERMISSION (PERIZINAN) APIs ---
export const getPermissions = (params) => api.get('/permissions', { params });
export const getPermissionById = (id) => api.get(`/permissions/${id}`);
export const createPermission = (data) => {
  // Check if data is FormData (for file upload)
  if (data instanceof FormData) {
    return api.post('/permissions', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return api.post('/permissions', data);
};
export const updatePermission = (id, data) => {
  // Check if data is FormData (for file upload)
  if (data instanceof FormData) {
    return api.put(`/permissions/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return api.put(`/permissions/${id}`, data);
};
export const deletePermission = (id) => api.delete(`/permissions/${id}`);

// --- PRESENCE (ABSENSI) APIs ---
export const getTodayPresence = () => api.get('/presences/today');
export const getPresences = (params) => api.get('/presences', { params });
export const checkIn = (formData) => api.post('/presences/check-in', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const checkOut = (formData) => api.post('/presences/check-out', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// --- LOGBOOK APIs ---
export const getLogbooks = (params) => api.get('/logbooks', { params });
export const getLogbookById = (id) => api.get(`/logbooks/${id}`);
export const createLogbook = (data) => api.post('/logbooks', data);
export const updateLogbook = (id, data) => api.put(`/logbooks/${id}`, data);
export const deleteLogbook = (id) => api.delete(`/logbooks/${id}`);
export const getLogbookStats = () => api.get('/logbooks/stats');

// --- INTERNSHIP APIs ---
export const getMentorInternships = () => api.get('/internships/mentor');

// --- MENTOR APIs ---
export const reviewLogbook = (id, action, rejection_reason = null) => 
  api.put(`/logbooks/${id}/review`, { action, rejection_reason });
export const reviewPermission = (id, action, rejection_reason = null) => 
  api.put(`/permissions/${id}/review`, { action, rejection_reason });

export default api;