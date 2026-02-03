export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isOwner: boolean;
  department?: string;
  jobTitle?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  planStartDate: string;
  planEndDate?: string;
  maxUsers: number;
  isActive: boolean;
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

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

