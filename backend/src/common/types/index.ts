import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    organizationId: string;
    email: string;
    role: string;
    isOwner: boolean;
    tenantId?: string; // Legacy support
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
