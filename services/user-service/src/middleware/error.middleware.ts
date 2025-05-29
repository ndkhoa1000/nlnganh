import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '@/utils/response';
import logger from '@/utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error: any) => ({
      field: error.path,
      message: error.message,
    }));
    ResponseHelper.validationError(res, errors);
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    ResponseHelper.conflict(res, message);
    return;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    ResponseHelper.error(res, 'Invalid ID format', 400);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    ResponseHelper.unauthorized(res, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ResponseHelper.unauthorized(res, 'Token expired');
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  ResponseHelper.error(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
};
