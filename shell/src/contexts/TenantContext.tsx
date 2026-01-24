import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant } from '../types';
import { apiClient } from '../lib/api-client';
import { storage } from '../lib/storage';

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  setTenant: (tenant: Tenant | null) => void;
  loadTenant: (tenantId: string) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initTenant = async () => {
      const tenantId = storage.getTenantId();
      if (tenantId) {
        try {
          // Load tenant details from API
          const tenantData = await apiClient.get<{ data: Tenant }>(`/tenants/${tenantId}`);
          setTenant(tenantData.data || tenantData);
        } catch (error) {
          console.error('Failed to load tenant:', error);
        }
      }
    };

    initTenant();
  }, []);

  const loadTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ data: Tenant }>(`/tenants/${tenantId}`);
      const tenantData = response.data || response;
      setTenant(tenantData);
      storage.setTenantId(tenantId);
    } catch (error) {
      console.error('Failed to load tenant:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        isLoading,
        setTenant,
        loadTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
