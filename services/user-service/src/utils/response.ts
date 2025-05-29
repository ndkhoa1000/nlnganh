import { Response } from 'express';
import { ApiResponse } from '@/types/common.types';
import logger from './logger';

export class ResponseHelper {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
    };

    logger.info(`Success response: ${statusCode}`, { response });
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string,
    statusCode: number = 500,
    errors?: any[]
  ): Response<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error,
      ...(errors && { errors }),
    };

    logger.error(`Error response: ${statusCode}`, { response });
    return res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    errors: any[],
    message: string = 'Validation failed'
  ): Response<ApiResponse> {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): Response<ApiResponse> {
    return this.error(res, message, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Access forbidden'
  ): Response<ApiResponse> {
    return this.error(res, message, 403);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response<ApiResponse> {
    return this.error(res, message, 404);
  }

  static conflict(
    res: Response,
    message: string = 'Resource already exists'
  ): Response<ApiResponse> {
    return this.error(res, message, 409);
  }

  static internalError(
    res: Response,
    message: string = 'Internal server error'
  ): Response<ApiResponse> {
    return this.error(res, message, 500);
  }
}

export const createPaginationResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) => {
  const pages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };
};
