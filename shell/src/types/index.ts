export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
  department?: string;
  jobTitle?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Phase 2: Multi-Tenant Types
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  theme: TenantTheme;
}

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
}

export interface LoginResponse {
  user: User;
  features: string[];
  tenant: Tenant | null;
  accessToken: string;
  refreshToken: string;
}

