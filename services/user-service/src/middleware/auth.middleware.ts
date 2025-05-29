import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/common.types';
import { UserRole } from '@/types/user.types';
import { ResponseHelper } from '@/utils/response';
import User from '@/models/User.model';
import config from '@/config';
import logger from '@/utils/logger';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ResponseHelper.unauthorized(res, 'Access token required');
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded._id);
    
    if (!user || !user.isActive) {
      ResponseHelper.unauthorized(res, 'Invalid token or user deactivated');
      return;
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      ResponseHelper.unauthorized(res, 'Invalid token');
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      ResponseHelper.unauthorized(res, 'Token expired');
      return;
    }

    ResponseHelper.internalError(res, 'Authentication failed');
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseHelper.unauthorized(res, 'Authentication required');
      return;
    }

    if (!roles.includes(req.user.role)) {
      ResponseHelper.forbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    const user = await User.findById(decoded._id);
    
    if (user && user.isActive) {
      req.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      };
    }

    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};
