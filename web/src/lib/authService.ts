import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  requiresOTP?: boolean;
  message?: string;
  email?: string;
  previewUrl?: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface OTPResendRequest {
  email: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Login request:', { email: data.email });
      const response = await api.post('/auth/login', data);
      console.log('Login response:', response.data);
      
      // Check if OTP is required
      if (response.data.requiresOTP) {
        return response.data;
      }
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/google', { idToken });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  appleLogin: async (idToken: string, fullName?: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/apple', { idToken, fullName });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Apple login error:', error);
      throw error;
    }
  },

  facebookLogin: async (accessToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/facebook', { accessToken });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Facebook login error:', error);
      throw error;
    }
  },

  verifyOTP: async (data: OTPVerifyRequest): Promise<AuthResponse> => {
    try {
      console.log('OTP verification request:', { email: data.email });
      const response = await api.post('/auth/verify-otp', data);
      console.log('OTP verification response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  resendOTP: async (data: OTPResendRequest): Promise<{ success: boolean; message: string; previewUrl?: string }> => {
    try {
      console.log('Resend OTP request:', { email: data.email });
      const response = await api.post('/auth/resend-otp', data);
      console.log('Resend OTP response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      console.log('Register request:', { name: data.name, email: data.email });
      const response = await api.post('/auth/register', data);
      console.log('Register response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/auth/update', data);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.put('/auth/change-password', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return await response.json()
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
