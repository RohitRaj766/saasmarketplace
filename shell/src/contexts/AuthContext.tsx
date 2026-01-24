import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '../types';
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
      const response = await apiClient.post<{
        success: boolean;
        data: {
          user: User;
          accessToken: string;
          refreshToken: string;
        };
        message?: string;
      }>('/auth/login', credentials);

      // Handle wrapped response from backend
      const { user, accessToken, refreshToken } = response.data || response;

      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);
      storage.setUser(user);

      // Phase 2: Store tenant ID
      if (user.tenantId) {
        storage.setTenantId(user.tenantId);
      }

      setUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
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
