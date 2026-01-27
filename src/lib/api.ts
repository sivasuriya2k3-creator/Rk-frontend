import axios from 'axios';

// Function to get the appropriate API URL based on environment
const getApiBaseUrl = () => {
  // Check if we have a custom API URL from environment
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  // If running on mobile/different device (not localhost), try to use current host IP
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If accessing from a network IP (not localhost), use that IP for API
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const apiUrl = `http://${hostname}:5002/api`;
      console.log('Mobile/Network device detected, using API URL:', apiUrl);
      return apiUrl;
    }
  }
  
  // Default to environment variable or localhost
  return envApiUrl || 'https://rk-backend.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
    const isOnLoginPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
    
    console.error('API Error:', {
      url: requestUrl,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      isAuthRequest,
      isOnLoginPage
    });
    
    // Clear auth on 401 unauthorized errors (but not for login/register attempts or if already on login page)
    if (error.response?.status === 401 && !isAuthRequest && !isOnLoginPage) {
      console.log('401 Unauthorized - Clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Export both default and named export
export { api as apiClient };
export { API_BASE_URL };
export default api;
