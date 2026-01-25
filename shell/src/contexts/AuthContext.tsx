import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, LoginResponse, Tenant } from '../types';
import { apiClient } from '../lib/api-client';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  features: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  hasFeature: (featureKey: string) => boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = storage.getUser();
      const storedTenant = storage.getTenant();
      const storedFeatures = storage.getFeatures();
      const token = storage.getAccessToken();

      if (storedUser && token) {
        setUser(storedUser);
        setTenant(storedTenant);
        setFeatures(storedFeatures);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<any>('/auth/login', credentials);

      // Backend returns: { success: true, data: { user, tenant, features, accessToken, refreshToken }, message }
      // apiClient.post returns response.data, so response = { success: true, data: {...}, message }
      
      let loginData: LoginResponse;
      
      if (response.success && response.data) {
        // Wrapped response - extract the data object
        loginData = response.data;
      } else if (response.user && response.accessToken) {
        // Direct response (fallback)
        loginData = response;
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }

      const { user, tenant, features, accessToken, refreshToken } = loginData;

      if (!user || !accessToken) {
        console.error('Missing auth data:', { user, accessToken });
        throw new Error('Missing required authentication data');
      }

      // Store auth data
      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);
      storage.setUser(user);
      storage.setTenant(tenant);
      storage.setFeatures(features || []);

      if (user.tenantId) {
        storage.setTenantId(user.tenantId);
      }

      // Update state
      setUser(user);
      setTenant(tenant);
      setFeatures(features || []);
      
      console.log('Login successful:', { user: user.email, tenant: tenant?.name });
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    storage.clearAuth();
    setUser(null);
    setTenant(null);
    setFeatures([]);
    window.location.href = '/login';
  };

  const hasFeature = (featureKey: string): boolean => {
    return features.includes(featureKey);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        features,
        isLoading,
        isAuthenticated: !!user,
        hasFeature,
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

