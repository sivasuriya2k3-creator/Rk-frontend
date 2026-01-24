/**
 * Comprehensive API Client for React/Vite Frontend
 * 
 * This file handles all communication with the backend
 * Supports error handling, loading states, and environment-based URLs
 * 
 * Usage:
 * import { fetchUsers, createUser } from '@/lib/api';
 * const users = await fetchUsers();
 */

// Get API URL from environment or use production Vercel URL as fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://rk-backend.vercel.app';

// Logger utility
const log = {
  info: (msg, data) => console.log(`ℹ️  ${msg}`, data),
  success: (msg, data) => console.log(`✅ ${msg}`, data),
  error: (msg, error) => console.error(`❌ ${msg}`, error),
  warn: (msg, data) => console.warn(`⚠️  ${msg}`, data),
};

/**
 * Generic fetch handler with error handling
 * @param {string} endpoint - API endpoint (e.g., '/users', '/orders/create')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} Response data or throws error
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    log.info(`Calling ${options.method || 'GET'} ${endpoint}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Check if response is OK
    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Check if API returned success: false
    if (!data.success) {
      throw new Error(data.error || 'API returned error');
    }

    log.success(`${options.method || 'GET'} ${endpoint}`, data);
    return data;
  } catch (error) {
    log.error(`${options.method || 'GET'} ${endpoint}`, error);
    throw error;
  }
}

// ==================== USER ENDPOINTS ====================

/**
 * Fetch all users
 * GET /api/users
 */
export async function fetchUsers() {
  return apiCall('/users', {
    method: 'GET',
  });
}

/**
 * Fetch single user by ID
 * GET /api/users/:id
 */
export async function fetchUser(userId) {
  return apiCall(`/users/${userId}`, {
    method: 'GET',
  });
}

/**
 * Create new user
 * POST /api/users/create
 */
export async function createUser({
  name,
  email,
  phone = '',
  company = '',
}) {
  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  return apiCall('/users/create', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      phone,
      company,
    }),
  });
}

/**
 * Update user
 * PUT /api/users/:id
 */
export async function updateUser(userId, userData) {
  return apiCall(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

/**
 * Delete user
 * DELETE /api/users/:id
 */
export async function deleteUser(userId) {
  return apiCall(`/users/${userId}`, {
    method: 'DELETE',
  });
}

// ==================== ORDER ENDPOINTS ====================

/**
 * Fetch all orders with optional filters
 * GET /api/orders?status=delivered&userId=123
 */
export async function fetchOrders(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.userId) {
    params.append('userId', filters.userId);
  }
  if (filters.paymentStatus) {
    params.append('paymentStatus', filters.paymentStatus);
  }

  let endpoint = '/orders';
  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  return apiCall(endpoint, {
    method: 'GET',
  });
}

/**
 * Fetch single order by ID
 * GET /api/orders/:id
 */
export async function fetchOrder(orderId) {
  return apiCall(`/orders/${orderId}`, {
    method: 'GET',
  });
}

/**
 * Create new order
 * POST /api/orders/create
 */
export async function createOrder({
  userId,
  productName,
  quantity,
  price,
  notes = '',
}) {
  if (!userId || !productName || !quantity || !price) {
    throw new Error(
      'userId, productName, quantity, and price are required'
    );
  }

  return apiCall('/orders/create', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      productName,
      quantity,
      price,
      notes,
    }),
  });
}

/**
 * Update order
 * PUT /api/orders/:id
 */
export async function updateOrder(orderId, orderData) {
  return apiCall(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  });
}

/**
 * Delete order
 * DELETE /api/orders/:id
 */
export async function deleteOrder(orderId) {
  return apiCall(`/orders/${orderId}`, {
    method: 'DELETE',
  });
}

// ==================== UTILITY ENDPOINTS ====================

/**
 * Health check
 * GET /api/health
 */
export async function checkHealth() {
  return apiCall('/health', {
    method: 'GET',
  });
}

/**
 * Get API documentation
 * GET /api
 */
export async function getApiDocs() {
  return apiCall('', {
    method: 'GET',
  });
}

// ==================== EXPORT ALL ====================

export default {
  // Users
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,

  // Orders
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  deleteOrder,

  // Utility
  checkHealth,
  getApiDocs,

  // Base URL
  API_BASE_URL,
};
