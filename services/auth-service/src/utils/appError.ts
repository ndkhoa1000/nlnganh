import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enums";

export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    public errorCode?: ErrorCodeEnumType;

    constructor(
        message: string,
        statusCode: HttpStatusCodeType = HTTPSTATUS.INTERNAL_SERVER_ERROR, 
        errorCode: ErrorCodeEnumType
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class HttpException extends AppError {
    constructor (
        message: string = "HTTP exception Error",
        statusCode: HttpStatusCodeType,
        errorCode: ErrorCodeEnumType
    ) {
        super(message, statusCode, errorCode);
    }
}

export class InternalServerException extends AppError {
    constructor (
        message: string = "Internal Server Error",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
        );
    }
}

export class BadRequestException extends AppError {
    constructor (
        message: string = "Bad Request",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.BAD_REQUEST,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR
        );
    }
}

export class UnauthorizedException extends AppError {
    constructor (
        message: string = "Unauthorized",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.UNAUTHORIZED,
            errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
        );
    }
}

export class ForbiddenException extends AppError {
    constructor (
        message: string = "Forbidden",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.FORBIDDEN,
            errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
        );
    }
}

export class NotFoundException extends AppError {
    constructor (
        message: string = "Not Found",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.NOT_FOUND,
            errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
        );
    }
}

export class MethodNotAllowedException extends AppError {
    constructor (
        message: string = "Method Not Allowed",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.METHOD_NOT_ALLOWED,
            errorCode || ErrorCodeEnum.METHOD_NOT_ALLOWED
        );
    }
}

export class ConflictException extends AppError {
    constructor (
        message: string = "Conflict",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.CONFLICT,
            errorCode || ErrorCodeEnum.CONFLICT
        );
    }
}

export class NotImplementedException extends AppError {
    constructor (
        message: string = "Not Implemented",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.NOT_IMPLEMENTED,
            errorCode || ErrorCodeEnum.NOT_IMPLEMENTED
        );
    }
}

export class BadGatewayException extends AppError {
    constructor (
        message: string = "Bad Gateway",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.BAD_GATEWAY,
            errorCode || ErrorCodeEnum.BAD_GATEWAY
        );
    }
}

export class ServiceUnavailableException extends AppError {
    constructor (
        message: string = "Service Unavailable",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.SERVICE_UNAVAILABLE,
            errorCode || ErrorCodeEnum.SERVICE_UNAVAILABLE
        );
    }
}

export class GatewayTimeoutException extends AppError {
    constructor (
        message: string = "Gateway Timeout",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTPSTATUS.GATEWAY_TIMEOUT,
            errorCode || ErrorCodeEnum.GATEWAY_TIMEOUT
        );
    }
}