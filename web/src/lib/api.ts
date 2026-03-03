import axios from 'axios';

// Get API base URL from environment
const getApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (envApiUrl) {
    // VITE_API_URL already includes /api path
    return envApiUrl;
  }

  // Development: use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5002/api';
  }

  // Production fallback (same server serves both)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
    const isOnLoginPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
    
    // Clear auth on 401 unauthorized errors
    if (error.response?.status === 401 && !isAuthRequest && !isOnLoginPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export { api as apiClient };
export { API_BASE_URL };
export default api;
