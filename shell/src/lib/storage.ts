const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  TENANT_ID: 'tenant_id',
  TENANT: 'tenant',
  FEATURES: 'features',
};

class Storage {
  setAccessToken(token: string): void {
    localStorage.setItem(KEYS.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS_TOKEN);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH_TOKEN);
  }

  setUser(user: any): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  getUser(): any | null {
    const user = localStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  setTenantId(tenantId: string): void {
    localStorage.setItem(KEYS.TENANT_ID, tenantId);
  }

  getTenantId(): string | null {
    return localStorage.getItem(KEYS.TENANT_ID);
  }

  setTenant(tenant: any): void {
    localStorage.setItem(KEYS.TENANT, JSON.stringify(tenant));
  }

  getTenant(): any | null {
    const tenant = localStorage.getItem(KEYS.TENANT);
    return tenant ? JSON.parse(tenant) : null;
  }

  setFeatures(features: string[]): void {
    localStorage.setItem(KEYS.FEATURES, JSON.stringify(features));
  }

  getFeatures(): string[] {
    const features = localStorage.getItem(KEYS.FEATURES);
    return features ? JSON.parse(features) : [];
  }

  clearAuth(): void {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.TENANT_ID);
    localStorage.removeItem(KEYS.TENANT);
    localStorage.removeItem(KEYS.FEATURES);
  }
}

export const storage = new Storage();

