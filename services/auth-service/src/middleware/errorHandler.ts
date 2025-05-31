import { ErrorRequestHandler } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import { ErrorCodeEnum } from '../enums/error-code.enums';
import { AppError } from '../utils/appError';


export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
    // Log the error internally (we'll enhance this with Winston later)
    console.error(`Error occurred on PATH: ${req.path} `, error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          errorCode: error.errorCode,
        });
    }
    
    // Handle built-in SyntaxError (e.g., malformed JSON)
    if (error instanceof SyntaxError && 'status' in error && (error as any).status === 400 && 'body' in error) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
              message: "Invalid request format. Please check your JSON payload.",
              errorCode: ErrorCodeEnum.VALIDATION_ERROR // Or a more specific one if you add it
        });
    }

    // For any other errors, send a generic internal server error response
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message:"An unexpected error occurred. Please try again later.",
        errorCode: ErrorCodeEnum.INTERNAL_SERVER_ERROR
        // In development, you might want to include more details, but not in production
        // error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
}