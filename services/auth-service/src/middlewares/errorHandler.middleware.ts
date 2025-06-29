import { ErrorRequestHandler } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import { z,ZodError } from 'zod';
import { ErrorCodeEnum } from '../enums/error-code.enums';
import { AppError } from '../utils/appError';

const formatZodError = (error: z.ZodError) => {
    const errors = error.issues.map((error) => ({
        field: error.path.join("."),
        message: error.message,
    }));
    return errors;
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
    console.error(`Error occurred on PATH: ${req.path} `, error);
    if (error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
              message: "Invalid JSON format. Please check your request"
        });
    };

    if(error instanceof ZodError){
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "validation failed",
            errors: formatZodError(error),
            errorCode: ErrorCodeEnum.VALIDATION_ERROR,
        })
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          errorCode: error.errorCode,
        });
    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message:"Internal Server Error",
        error: error?.message || "Unknown error occurred."
    })
}