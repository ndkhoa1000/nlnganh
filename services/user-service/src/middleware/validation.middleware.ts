import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ResponseHelper } from '@/utils/response';
import logger from '@/utils/logger';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation error:', { errors: validationErrors });
      ResponseHelper.validationError(res, validationErrors);
      return;
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Query validation error:', { errors: validationErrors });
      ResponseHelper.validationError(res, validationErrors);
      return;
    }

    req.query = value;
    next();
  };
};
