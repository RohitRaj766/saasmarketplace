import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { AuthRequest } from '../../common/types';
import { ResponseUtil } from '../../common/utils/response.util';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseUtil.unauthorized(res, 'No token provided');
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwt.secret) as any;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId, // Phase 2
    };

    // Phase 2: Validate tenant header matches JWT
    const tenantHeader = req.headers['x-tenant-id'] as string;
    if (decoded.tenantId && tenantHeader && decoded.tenantId !== tenantHeader) {
      return ResponseUtil.forbidden(res, 'Tenant mismatch');
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return ResponseUtil.unauthorized(res, 'Token expired');
    }
    return ResponseUtil.unauthorized(res, 'Invalid token');
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseUtil.unauthorized(res);
    }

    if (!roles.includes(req.user.role)) {
      return ResponseUtil.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
}
