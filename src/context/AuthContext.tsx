import * as React from 'react';
import { authService, User } from '@/lib/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  appleLogin: (idToken: string, fullName?: string) => Promise<void>;
  facebookLogin: (accessToken: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  setAuthUser: (user: User) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    // Initialize from localStorage immediately to prevent logout on reload
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      if (token && userJson) {
        try {
          return JSON.parse(userJson);
        } catch (e) {
          console.error('Failed to parse user from localStorage:', e);
          return null;
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      // If OTP is required, throw the response to let Login page handle it
      if (response.requiresOTP) {
        throw { response: { data: response } };
      }
      
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (idToken: string) => {
    try {
      const response = await authService.googleLogin(idToken);
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const appleLogin = async (idToken: string, fullName?: string) => {
    try {
      const response = await authService.appleLogin(idToken, fullName);
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const facebookLogin = async (accessToken: string) => {
    try {
      const response = await authService.facebookLogin(accessToken);
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, confirmPassword: string) => {
    try {
      const response = await authService.register({ name, email, phone, password, confirmPassword });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const setAuthUser = (user: User) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        appleLogin,
        facebookLogin,
        register,
        logout,
        setAuthUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
