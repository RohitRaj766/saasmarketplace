import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, LoginResponse } from '../types';
import { apiClient } from '../lib/api-client';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = storage.getUser();
      const token = storage.getAccessToken();

      if (storedUser && token) {
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<any>('/auth/login', credentials);
      
      let loginData: LoginResponse;
      
      if (response.success && response.data) {
        loginData = response.data;
      } else if (response.user && response.accessToken) {
        loginData = response;
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }

      const { user, accessToken, refreshToken } = loginData;

      if (!user || !accessToken) {
        console.error('Missing auth data:', { user, accessToken });
        throw new Error('Missing required authentication data');
      }

      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);
      storage.setUser(user);

      setUser(user);
      
      console.log('Login successful:', { user: user.email });
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    storage.clearAuth();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

