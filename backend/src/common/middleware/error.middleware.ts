import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return ResponseUtil.error(res, err.message, err.statusCode, err.errors);
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return ResponseUtil.error(res, 'Database error', 400);
  }

  // Handle validation errors
  if (err.name === 'ZodError') {
    return ResponseUtil.error(res, 'Validation error', 400, err);
  }

  // Default error
  return ResponseUtil.serverError(res, 'Something went wrong');
}

export function notFoundHandler(req: Request, res: Response) {
  return ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
}
